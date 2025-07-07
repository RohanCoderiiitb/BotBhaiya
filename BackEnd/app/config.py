# This code loads all the environment variables and makes it accessible throughout FastAPI integration

#Importing necessary libraries
import os 
from dotenv import load_dotenv

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
USER_AGENT = os.getenv("USER_AGENT")
PERSIST_DIRECTORY = os.getenv("PERSIST_DIR", "./chroma_index")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM") 

if not GOOGLE_API_KEY:
    raise ValueError("Google API key not found")
if not USER_AGENT:
    print("Warning: USER_AGENT not found in environment variables. Some document loaders might be affected.")
if not SECRET_KEY:
    raise ValueError("Secret key not found! JWT generation will fail")

os.environ['GOOGLE_API_KEY'] = GOOGLE_API_KEY
os.environ['USER_AGENT'] = USER_AGENT 

DEFAULT_EMBEDDING_MODEL = "models/embedding-001"
DEFAULT_LLM_MODEL = "gemini-2.5-flash"