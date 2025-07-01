#This code tests the chatbot built

#Importing necessary documents
import os
import json
from dotenv import load_dotenv
from ChatBot import Indexing, Generation, query_translation

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

urls_or_paths = load_from_file("./BackEnd/data.json")
indexing = Indexing(
        urls_or_paths,
        "./BackEnd/Chroma-Index",
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