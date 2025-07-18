# Entry point to the FastAPI application
# Creates the core app instances, registers all the routes and sets up essential resources

# Importing necessary libraries
import os
from fastapi import FastAPI
from contextlib import asynccontextmanager
from .routes import router
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from .config import GOOGLE_API_KEY, PERSIST_DIRECTORY, DEFAULT_EMBEDDING_MODEL
from fastapi.middleware.cors import CORSMiddleware
from .database import create_user_table, create_chat_history_table

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles startup and shutdown events of application
    Initialises RAG retriever instance on startup
    """
    print(f"[__name__] Ensuring that the user table exists")
    create_user_table()
    print(f"[__name__] User table ready")

    print(f"[__name__] Ensuring that chat history table exists")
    create_chat_history_table()
    print(f"[__name__] Chat history table ready")

    print(f"[{__name__}] Application starting up..")
    print(f"[app.main] Checking for persist directory: {PERSIST_DIRECTORY}")
    
    print(f"[app.main] Resolved absolute path for PERSIST_DIRECTORY: {os.path.abspath(PERSIST_DIRECTORY)}") 
    
    os.makedirs(PERSIST_DIRECTORY, exist_ok=True)
    print(f"[app.main] Persist directory ensured: {PERSIST_DIRECTORY}")
    try:
        embedding_model = GoogleGenerativeAIEmbeddings(
            model = DEFAULT_EMBEDDING_MODEL,
            google_api_key = GOOGLE_API_KEY
        )
        vector_stores = Chroma(
            persist_directory = PERSIST_DIRECTORY,
            embedding_function = embedding_model
        )
        retriever_instance = vector_stores.as_retriever(
            search_type = "mmr",
            search_kwargs = {"k":10}
        )
        app.state.retriever_instance = retriever_instance
        print(f"[{__name__}] RAG pipeline initialised and retriever instance saved in app.state")
    except Exception as e:
        print(f"[{__name__}] CRITICAL ERROR during RAG pipeline initialisation: {e}") 
        raise 
    
    yield

    print(f"[{__name__}] Application shutting down..")

app = FastAPI(
    title = "IIITB Freshers chatbot API",
    description = "A retrieval augemented generation (RAG) based chatbot that answers user queries",
    version = "1.0.0",
    lifespan = lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost","http://localhost:5173", "http://localhost:5174"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

app.include_router(router)

@app.get("/")
async def root():
    return {"message" : "Welcome to BotBhaiya"}