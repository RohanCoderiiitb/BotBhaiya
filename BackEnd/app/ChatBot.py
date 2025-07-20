# backend/app/chatbot.py

# Importing necessary libraries
import os
from typing import Set, Tuple, Any # Added Any for type hinting
from langchain_community.document_loaders import PyPDFLoader, UnstructuredMarkdownLoader, WebBaseLoader, UnstructuredPowerPointLoader, UnstructuredWordDocumentLoader, TextLoader # Ensure TextLoader is imported
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_chroma import Chroma
from chromadb import PersistentClient
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.memory import BaseMemory 
from langchain_core.messages import HumanMessage, AIMessage
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from .config import GOOGLE_API_KEY, PERSIST_DIRECTORY, DEFAULT_EMBEDDING_MODEL, DEFAULT_LLM_MODEL

class Indexing:
    """
    The Indexing class processes documents from URLs or file paths by loading, chunking, embedding, 
    and storing them in a Chroma vector database using Google Generative AI embeddings. It builds a 
    retriever for efficient semantic search over the indexed document chunks.
    """
    def __init__(self, urls: list, persist_dir: str, embeddingmodel: str, api_key: str, chunk_size: int = 2000, chunk_overlap: int = 400): # Added type hints
        self.urls = urls
        self.persist_dir = persist_dir
        self.embeddingmodel = embeddingmodel
        self.api_key = api_key
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.embedding_model_instance = GoogleGenerativeAIEmbeddings(model=self.embeddingmodel, google_api_key=self.api_key)
        self.vector_store = Chroma(persist_directory=self.persist_dir, embedding_function=self.embedding_model_instance)


    def load_documents(self):
        """
        This function loads all the documents from the specified directory
        Returns a list of all the documents loaded
        """
        all_docs = []
        if not self.urls:
            raise ValueError("No document paths or urls provided")
        for url in self.urls:
            try:
                if url.startswith("http"):
                    print(f"[{__name__}] Loading web document from: {url}")
                    loader = WebBaseLoader(url)
                else:
                    abs_file_path = os.path.abspath(url)
                    if url.endswith(".pdf"):
                        print(f"[{__name__}] Loading local PDF document from: {abs_file_path}")
                        loader = PyPDFLoader(abs_file_path)
                    elif url.endswith(".md"):
                        print(f"[{__name__}] Loading local Markdown document from: {abs_file_path}")
                        loader = UnstructuredMarkdownLoader(abs_file_path)
                    elif url.endswith(".pptx") or url.endswith(".ppt"):
                        print(f"[{__name__}] Loading local PowerPoint document from: {abs_file_path}")
                        loader = UnstructuredPowerPointLoader(abs_file_path)
                    elif url.endswith(".docx") or url.endswith(".doc"):
                        print(f"[{__name__}] Loading local Word document from: {abs_file_path}")
                        loader = UnstructuredWordDocumentLoader(abs_file_path)
                    elif url.endswith(".txt"): 
                        print(f"[{__name__}] Loading local Text document from: {abs_file_path}")
                        loader = TextLoader(abs_file_path)
                    else:
                        raise ValueError(f"⚠️ Unsupported file type: {abs_file_path}")
                docs = loader.load()
                for doc in docs:
                    doc.metadata["source"] = url
                all_docs.extend(docs)
                print(f"[{__name__}] Successfully loaded: {url}")
            except Exception as e:
                print(f"[{__name__}] Failed to load {url}: {e}")
        if not all_docs:
            raise RuntimeError("❌ No documents were successfully loaded")
        return all_docs
    
    def document_splitter(self, docs):
        """
        This functions splits the documents into smaller chunks 
        Returns a list of smaller document chunks with specified chunk sizes and overlap
        """
        splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
            chunk_size = self.chunk_size,
            chunk_overlap = self.chunk_overlap
        )
        splits = splitter.split_documents(docs)
        return splits
    
    def embed_and_store(self, splits):
        """
        Embeds and stores the given chunks of documents into a persistent vector database using Chroma.
        This method ADDS documents to the existing vector store.
        """
        print(f"[{__name__}] Adding {len(splits)} chunks to ChromaDB...")
        self.vector_store.add_documents(documents=splits) 
        print(f"[{__name__}] Chunks added and persisted.")
    
    def build_indexing(self):
        """
        Initiates the indexing process and builds a retriever for semantic search.
        Returns an instance of the retriever class used to perform similarity-based searches over the embedded document chunks.
        """
        print(f"[{__name__}] Starting document indexing process...")
        docs = self.load_documents()
        print(f"[{__name__}] Splitting {len(docs)} documents into chunks...")
        splits = self.document_splitter(docs)
        print(f"[{__name__}] Created {len(splits)} chunks.")

        self.embed_and_store(splits) 
        
        retriever = self.vector_store.as_retriever( 
            search_type = "mmr",
            search_kwargs = {"k":10}
        )
        print(f"[{__name__}] Indexing complete. Retriever ready.")
        return retriever

class Generation:
    """
    The Generation class handles response generation by retrieving relevant document chunks and passing them to 
    a large language model(Gemini 2.5 Flash). It enables semantic question-answering over indexed content using 
    a retriever and a generative model.
    """
    def __init__(self, query, api_key, retriever, model, memory: BaseMemory):
        """
        Initializes the Generation class.

        Args:
            query (str): The current user query.
            api_key (str): Google API key for the LLM.
            retriever (Any): The LangChain retriever instance (from ChromaDB).
            model (str): The LLM model to use.
            memory (BaseMemory): A pre-configured LangChain memory object (e.g., ConversationBufferWindowMemory).
        """
        self.query = query
        self.api_key = api_key
        self.retriever = retriever
        self.model = model
        self.memory = memory

        self.llm = ChatGoogleGenerativeAI(
            model = self.model,
            temperature = 0,
            google_api_key = self.api_key
        )

        contextualize_q_system_prompt = """Given a chat history and the latest user question \
        which might reference context in the chat history, formulate a standalone question \
        which can be understood without the chat history. Do NOT answer the question, \
        just reformulate it if necessary and otherwise return it as is."""

        contextualize_q_prompt = ChatPromptTemplate.from_messages(
            [("system", contextualize_q_system_prompt),
             MessagesPlaceholder("chat_history"),
             ("human", "{input}")
            ]
        )
        self.history_aware_retriever = create_history_aware_retriever(
            self.llm, self.retriever, contextualize_q_prompt
        )

        qa_system_prompt = """You are an assistant for question-answering tasks for IIITB Freshers. \
        Use the following retrieved context and chat history to answer the question. \
        If you don't know the answer, just say that you don't know. \
        Keep the answer concise and to the point.
        {context}"""

        qa_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", qa_system_prompt),
                MessagesPlaceholder("chat_history"),
                ("human", "{input}"),
            ]
        )

        self.document_chain = create_stuff_documents_chain(self.llm, qa_prompt)
        self.rag_chain = create_retrieval_chain(self.history_aware_retriever, self.document_chain)

    def generate(self):
        """
        Generates response by retrieving the relevant document chunks and passing them to the LLM.
        Returns the response generated and the sources refered to, for the answer
        """
        
        chat_history_messages = self.memory.load_memory_variables({})["chat_history"]

        response = self.rag_chain.invoke({
            "input": self.query,
            "chat_history": chat_history_messages
        })

        answer = response["answer"]
        sources = set()
        if "context" in response:
            for doc in response["context"]:
                if doc.metadata and "source" in doc.metadata:
                    sources.add(doc.metadata["source"])
            
        self.memory.save_context({"input":self.query}, {"output":answer})
        return answer, sources