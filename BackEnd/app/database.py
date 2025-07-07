# Creating a database for storing user data

# Importing necessary libraries
import sqlite3
import os

database_name = "Users.db"
database_path = os.path.join(os.path.dirname(__file__), database_name)

def get_db_connection():
    """
    Establishing connection with sqlite3 database
    """
    conn = sqlite3.connect(database_path)
    conn.row_factory = sqlite3.Row
    return conn

def create_user_table():
    """
    Creates a table "user" in Users database
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hashed TEXT NOT NULL )
        """)
    conn.commit()
    conn.close()
    print(f"[{__name__}] User table ensured in {database_path}")