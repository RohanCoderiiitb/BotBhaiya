#This code tests the chatbot built

#Importing necessary documents
import os
import json
from dotenv import load_dotenv
from chatbot import Indexing, Generation, query_translation
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
USER_AGENT = os.getenv("USER_AGENT")
if not GOOGLE_API_KEY:
    raise ValueError("Google API Key not found!")
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY
os.environ["USER_AGENT"] = USER_AGENT

def load_from_file(filepath):
    """
    This functions extracts all the urls/file paths(data to be used) from a json file
    Returns a list of all the extracted urls/file paths
    """
    with open (filepath, "r") as f:
        data = json.load(f)
    return data.get("documents", [])

persist_dir = "./backend/app/chroma_index"
embeddingmodel = "models/embedding-001"

embedding_model = GoogleGenerativeAIEmbeddings(
    model=embeddingmodel,
    google_api_key=GOOGLE_API_KEY
)

if os.path.exists(persist_dir) and os.listdir(persist_dir):
    vector_stores = Chroma(persist_directory=persist_dir, embedding_function=embedding_model)
    retriever = vector_stores.as_retriever(search_type="mmr", search_kwargs={"k":10})

else:
    urls_or_paths = load_from_file("./backend/app/data.json")
    indexing = Indexing(
        urls_or_paths,
        "./backend/app/chroma_index",
        "models/embedding-001",
        GOOGLE_API_KEY
    )
    retriever = indexing.build_indexing()

while True:
    query = input("Ask: ")
    if query.lower()=="stop":
        break
    else:
        formatted_query = query_translation(
        query,
        GOOGLE_API_KEY
        )
        generator = Generation(
            formatted_query,
            GOOGLE_API_KEY,
            retriever
        )
        response, sources = generator.generate()
        print(f"Answer: {response}")
        print()
        print("Sources..")
        for source in sources:
            print(f"🔗 {source}")
