# This code defines the API endpoints and the logic for handling the client requests

#Importing the necessary modules
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import *
from .chatbot import Indexing, Generation, query_translation
from .config import GOOGLE_API_KEY, PERSIST_DIRECTORY, DEFAULT_EMBEDDING_MODEL, DEFAULT_LLM_MODEL

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

class ChatResponse(BaseModel):
    """
    Schema for the response from the chatbot
    Returns the generated answer and a list of the source URLs
    """
    answer: str
    sources: List[str]

@router.post("/indexing", response_model=Dict[str, str])
async def index_docs(request: Request, index_request_data: IndexRequest):
    """
    This is an endpoint to trigger document indexing.
    Expects a list of URLs in the request body
    This action will (re)build or update the knowledge base
    """
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
async def chat_with_bot(request: Request, chat_request_data: ChatRequest):
    """
    This is the endpoint for chatting with the bot
    Expects a single user query
    Returns an answer(str) and list of sources
    """
    retriever_instance = request.app.state.retriever_instance
    if retriever_instance is None:
        raise HTTPException(status_code=503, detail="Retriever has not been initialised")
    
    user_query = chat_request_data.query
    print(f"[{__name__}] Received query: {user_query}")

    try:
        rewritten_query = query_translation(user_query, GOOGLE_API_KEY, DEFAULT_LLM_MODEL)
        generator = Generation(
            query = rewritten_query,
            api_key = GOOGLE_API_KEY,
            retriever = retriever_instance,
            model = DEFAULT_LLM_MODEL
        )
        answer, sources = generator.generate()
        print(f"[{__name__}] Generated answer: {answer}")
        print(f"[{__name__}] Sources: {list(sources)}")
        return ChatResponse(answer = answer, sources = list(sources))
    except Exception as e:
        print(f"[{__name__}] An error occurred: {e}")
        raise HTTPException(status_code=500, detail="An error occurred")