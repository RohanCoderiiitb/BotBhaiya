# This code defines the API endpoints and the logic for handling the client requests

#Importing the necessary modules
import os
from fastapi import APIRouter, HTTPException, Request, Depends, status
from pydantic import BaseModel
from typing import List, Dict, Optional
from .chatbot import Indexing, Generation
from .config import GOOGLE_API_KEY, PERSIST_DIRECTORY, DEFAULT_EMBEDDING_MODEL, DEFAULT_LLM_MODEL
from .database import get_db_connection  
from .security import hash_password, verify_password
from .auth import create_access_token, get_current_user
from datetime import timedelta
import uuid
from langchain_community.chat_message_histories import SQLChatMessageHistory
from langchain.memory import ConversationBufferWindowMemory
from sqlalchemy import create_engine
from fastapi.responses import RedirectResponse
from starlette.requests import Request as StarletteRequest
from .google_oauth import oauth

router = APIRouter()

class IndexRequest(BaseModel):
    """
    Schema for the request body when indexing documents
    Expects a list of URLs(strings)
    """
    urls: List[str]

class ChatRequest(BaseModel):
    """
    Schema for the request body when chatting with the bot
    Expects a single query string from the user
    """
    query: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    """
    Schema for the response from the chatbot
    Returns the generated answer and a list of the source URLs
    """
    answer: str
    sources: List[str]

class UserCreate(BaseModel):
    """
    Schema for user registration to the application
    """
    username: str
    password: str

class UserLogin(BaseModel):
    """
    Schema for user login
    """
    username: str
    password: str

class Token(BaseModel):
    """
    Schema for authentication token respone
    """
    access_token: str
    token_type: str = 'bearer'

@router.post("/indexing", response_model=Dict[str, str])
async def index_docs(request: Request, index_request_data: IndexRequest, current_user: str = Depends(get_current_user)):
    """
    This is an endpoint to trigger document indexing.
    Expects a list of URLs in the request body
    This action will (re)build or update the knowledge base
    """
    print(f"[__name__] Indexing request by Authenticated User: {current_user}")
    retriever_instance = request.app.state.retriever_instance
    if not index_request_data.urls:
        raise HTTPException(status_code=400, detail="No URL(s) provided for indexing")
    print(f"[{__name__}] Received indexing requests for URLs: {index_request_data.urls}")

    try:
        indexing = Indexing(
            urls=index_request_data.urls,
            persist_dir=PERSIST_DIRECTORY,
            embeddingmodel=DEFAULT_EMBEDDING_MODEL,
            api_key=GOOGLE_API_KEY
        )
        new_retriever_instance = indexing.build_indexing()
        request.app.state.retriever_instance = new_retriever_instance
        print(f"[{__name__}] Indexing complete and retriever updated successfully in app.state.")
        return {"message": "Documents indexed successfully and retriever updated."}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=f"Indexing failed due to invalid input: {str(ve)}")
    except RuntimeError as re:
        raise HTTPException(status_code=500, detail=f"Indexing process encountered a runtime error: {str(re)}")
    except Exception as e:
        print(f"[{__name__}] ERROR during indexing: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred during indexing: {str(e)}")
    
@router.post("/chat", response_model=ChatResponse)
async def chat_with_bot(request: Request, chat_request_data: ChatRequest, current_user_username: str = Depends(get_current_user)):
    """
    This is the endpoint for chatting with the bot
    Expects a single user query
    Returns an answer(str) and list of sources
    """
    print(f"[{__name__}] Chat request received with body: {chat_request_data}")
    print(f"[{__name__}] Authenticated user from dependency: {current_user_username}")
    retriever_instance = request.app.state.retriever_instance
    if retriever_instance is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Retriever has not been initialized")
    
    user_query = chat_request_data.query
    print(f"[{__name__}] Processing query: {user_query}")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users where username=?", (current_user_username,))
    user_db = cursor.fetchone()
    print(f"[{__name__}] Database query result: {user_db}")
    conn.close()
    
    if not user_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Authenticated user not found")
    user_id = user_db['id']

    session_id = chat_request_data.session_id
    if not session_id:
        session_id = str(uuid.uuid4())
        print(f"[{__name__}] New chat session started for {current_user_username}: {session_id}")
    else:
        print(f"[{__name__}] Continuing chat session {session_id} for {current_user_username}")

    db_path_absolute = os.path.abspath(os.path.join(os.path.dirname(__file__), "Users.db"))
    engine = create_engine(f"sqlite:///{db_path_absolute}")

    print(SQLChatMessageHistory.__init__)

    message_history = SQLChatMessageHistory(
        session_id=f"{user_id}_{session_id}",
        connection=engine,
        table_name="chat_history",
        session_id_field_name="session_id"
    )

    conversational_memory = ConversationBufferWindowMemory(
        k=5,
        chat_memory=message_history,
        memory_key="chat_history",
        return_messages=True
    )

    try:
        generator = Generation(
            query = user_query,
            api_key = GOOGLE_API_KEY,
            retriever = retriever_instance, 
            model = DEFAULT_LLM_MODEL,
            memory=conversational_memory
        )
        answer, sources = generator.generate()
        print(f"[{__name__}] Generated answer: {answer}")
        print(f"[{__name__}] Sources: {list(sources)}")
        return ChatResponse(answer = answer, sources = list(sources), session_id = session_id)
    except Exception as e:
        print(f"[{__name__}] An error occurred: {e}")
        raise HTTPException(status_code=500, detail="An error occurred")
    
@router.post("/signup", response_model=Dict[str, str])
async def signup(user: UserCreate):
    """
    Registers a new user
    Stores the username and password in the user table
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE username=?", (user.username,))

    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="User already registered")
    
    hashed_password = hash_password(user.password)

    try:
        cursor.execute(
            "INSERT INTO users (username, password_hash) VALUES (?, ?)",
            (user.username, hashed_password)
        )
        conn.commit()
        conn.close()
        print(f"[__name__] User {user.username} signed up successfully!")
        return {"message": "user registered successfully"}
    except Exception as e:
        conn.close()
        print(f"[__name__] Error during signup for the user {user.username}: {e}")
        raise HTTPException(status_code=500, detail="Failed to register user")
    
@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    """
    Facilitates user login
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, password_hash FROM users WHERE username = ?", (user.username,))
    db_user = cursor.fetchone()
    if not db_user:
        conn.close()
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    if not verify_password(user.password, db_user["password_hash"]):
        conn.close()
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token_expiry = timedelta(minutes=30)
    conn.close()
    access_token = create_access_token(
        data={"sub": db_user["username"]},
        expires_delta=access_token_expiry
    )
    print(f"[{__name__}] User {db_user['username']} logged in successfully. JWT issued")
    return Token(access_token=access_token, token_type="bearer")

@router.get("/auth/google/login")
async def google_login(request: StarletteRequest):
    redirect_uri = "http://localhost:8000/auth/google/callback"
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth/google/callback")
async def google_callback(request: StarletteRequest):
    token = await oauth.google.authorize_access_token(request)
    user_info = await oauth.google.userinfo(token=token)
    
    username = user_info.get("email")
    if not username:
        raise HTTPException(status_code=400, detail="Google login failed")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()

    if not user:
        hashed_pw = hash_password("google-oauth")
        cursor.execute(
            "INSERT INTO users (username, password_hash) VALUES (?, ?)",
            (username, hashed_pw)
        )
        conn.commit()

    conn.close()

    # Generate JWT
    access_token = create_access_token({"sub": username})
    
    redirect_url = f"http://localhost:5173/auth/google/success?token={access_token}"
    return RedirectResponse(url=redirect_url)