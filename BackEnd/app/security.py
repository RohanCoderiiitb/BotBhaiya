# Centralises and manages all operations regarding password security

# Importing necessary libraries
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Hashes a plain-text password using bcrypt.
    Returns the hashed password string.
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain-text password against a hashed password.
    Returns True if the plain-text password matches the hashed password, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)