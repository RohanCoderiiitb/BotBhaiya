# This code implements a RAG pipeline to build the AI Chatbot

#Importing the necessary libraries
import os
from langchain_community.document_loaders import PyPDFLoader, UnstructuredMarkdownLoader, WebBaseLoader, UnstructuredPowerPointLoader, UnstructuredWordDocumentLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate

class Indexing:
    """
    The Indexing class processes documents from URLs or file paths by loading, chunking, embedding, 
    and storing them in a Chroma vector database using Google Generative AI embeddings. It builds a 
    retriever for efficient semantic search over the indexed document chunks.
    """
    def __init__(self, urls, persist_dir, embeddingmodel, api_key, chunk_size=1000, chunk_overlap=200):
        self.urls = urls
        self.persist_dir = persist_dir
        self.embeddingmodel = embeddingmodel
        self.api_key = api_key
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

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
                    loader = WebBaseLoader(url)
                else:
                    abs_file_path = os.path.abspath(url)
                    if url.endswith(".pdf"):
                        loader = PyPDFLoader(abs_file_path)
                    elif url.endswith(".md"):
                        loader = UnstructuredMarkdownLoader(abs_file_path)
                    elif url.endswith(".pptx") or url.endswith(".ppt"):
                        loader = UnstructuredPowerPointLoader(abs_file_path)
                    elif url.endswith(".docx") or url.endswith(".doc"):
                        loader = UnstructuredWordDocumentLoader(abs_file_path)
                    else:
                        raise ValueError(f"⚠️ Unsupported file type: {abs_file_path}")
                docs = loader.load()
                for doc in docs:
                    doc.metadata["source"] = url
                all_docs.extend(docs)
            except Exception as e:
                print(f"Failed to load {url}: {e}")
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
    
    def embedd_and_store(self, splits):
        """
        Embeds and stores the given chunks of documents into a persistent vector database using Chroma
        A Chroma vector store instance containing the embedded documents, persisted to disk.
        """
        embedding_model = GoogleGenerativeAIEmbeddings(model=self.embeddingmodel, google_api_key=self.api_key)
        vector_stores = Chroma.from_documents(documents=splits, embedding=embedding_model, persist_directory=self.persist_dir)
        vector_stores.persist()
        return vector_stores
    
    def build_indexing(self):
        """
        Initiates the indexing process and builds a retriever for semantic search
        Returns an instance of the retriever class used to perform similarity-based searches over the embedded document chunks
        """
        docs = self.load_documents()
        splits = self.document_splitter(docs)
        vector_stores = self.embedd_and_store(splits)
        retriever = vector_stores.as_retriever(
            search_type = "mmr",
            search_kwargs = {"k":10}
        )
        return retriever

def query_translation(query, api_key, my_model):
    """
    This function implements query translation - the process of modifying/ transforming user's queries to improve the effectiveness 
    of the retrieval process.
    Returns the rewritten query
    """
    llm = ChatGoogleGenerativeAI(
        model = my_model,
        google_api_key = api_key,
        temperature = 0.3
    )

    template = """You are a helpful AI assistant who rewrites user's queries to improve document retrieval
                  Original question: {query}
                  Rewritten retrieval query:"""
    prompt = ChatPromptTemplate.from_template(template)
    formatted_prompt = prompt.invoke({"query":query})
    formatted_query = llm.invoke(formatted_prompt).content.strip()
    return formatted_query 

class Generation:
    """
    The Generation class handles response generation by retrieving relevant document chunks and passing them to 
    a large language model(Gemini 2.5 Flash). It enables semantic question-answering over indexed content using 
    a retriever and a generative model.
    """
    def __init__(self, query, api_key, retriever, model):
        self.query = query
        self.api_key = api_key
        self.retriever = retriever
        self.model = model

    def generate(self):
        """
        Generates response by retrieving the relevant document chunks and passing them to the LLM.
        Returns the response generated and the sources refered to, for the answer
        """
        llm = ChatGoogleGenerativeAI(
            model = self.model,
            google_api_key = self.api_key,
            temperature = 0
        )

        template = """You are a helpful and knowledgeable AI assistant.
                      Use only the information provided in the context 
                      to respond accurately and concisely to the input question or request.
                      The context exclusively pertains to IIIT Bangalore (IIITB). 
                      If the context does not include enough information, politely indicate that.

                      Context:{context}
                      User query:{query}
                    """
        prompt = ChatPromptTemplate.from_template(template)

        retrieved_docs = self.retriever.invoke(self.query)
        context = "\n\n".join(doc.page_content for doc in retrieved_docs)
        formatted_prompt = prompt.invoke({"query":self.query, "context":context})
        answer = llm.invoke(formatted_prompt)
        sources = set(doc.metadata.get("source", "Unknown source") for doc in retrieved_docs)
        return answer.content, sources 