# Generation of JWT token

# Importing necessary libraries
from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt 
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from .config import SECRET_KEY, ALGORITHM
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .database import get_db_connection

oauth2_scheme = HTTPBearer()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Creates a JWT access token.
    Returns encoded JWT string
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=30)
    to_encode.update({"exp": expire}) 
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    """
    Decodes a JWT access token and verifies its signature and expiration
    Returns a dictionary, the decoded token payload
    """
    try:
        if token.startswith("Bearer"):
            token = token.split("Bearer ")[-1]

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Couldn't validate the credentials",
            headers={"WWW-Authenticate":"Bearer"}
            )
        return payload
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate":"Bearer"}
        )
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate":"Bearer"}
        )

async def get_current_user(token: HTTPAuthorizationCredentials = Depends(oauth2_scheme)):
    """
    Obtains the current user from JWT
    """
    payload = decode_access_token(token.credentials)
    username: str = payload.get("sub")
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Couldn't validate the credentials",
            headers={"WWW-Authenticate":"Bearer"}
        )
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username FROM users WHERE username = ?", (username,))
    user_db = cursor.fetchone()
    if not user_db:
        conn.close()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user_db['username']