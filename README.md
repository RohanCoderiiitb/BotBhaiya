# 🤖 BotBhaiya — Your Friendly IIITB Freshers' Assistant

**BotBhaiya** is an AI-powered campus assistant designed to answer **any kind of question a fresher might have about IIIT Bangalore** — from factual queries like *"What electives does the ECE department offer?"* to opinion-based ones like *"Any tips for surviving the first semester?"*  

It combines **accurate, sourced information** with a conversational, approachable tone — making it feel like chatting with a helpful senior.

---

## ✨ Features

- **📚 Factual Queries** — Pulls information from official IIITB documents, handbooks, and curated datasets.
- **💬 Opinion-Based Advice** — Provides guidance backed by testimonials from seniors.
- **🔐 Authentication** — User & admin login with Google OAuth support.
- **🗂 Chat History** — View past conversations.
- **⚙️ Retriever Management** — Admin panel to add/delete knowledge retrievers, viewing the users' chat history, etc.
- **🖥 Full-Stack App** — Built with React (frontend) and Python FastAPI (backend).

---

## 📂 Project Structure

```
BotBhaiya/
│
├── FrontEnd/                 # React frontend
│   ├── src/
│   │   ├── assets/           # Images, icons, styles
│   │   ├── components/       # Reusable UI components
│   │   │   ├── adminlogin.jsx
│   │   │   ├── adminpage.jsx
│   │   │   ├── chat.jsx
│   │   │   ├── delete-retriever.jsx
│   │   │   ├── googlesuccess.jsx
│   │   │   ├── indexing.jsx
│   │   │   ├── landingpage.jsx
│   │   │   ├── userlogin.jsx
│   │   │   ├── usersignup.jsx
│   │   │   └── view-chat-history.jsx
│   └── public/               # Static assets
│
├── BackEnd/                   # Python FastAPI backend
│   ├── app/
│   │   ├── Data/              # Curated IIITB dataset & configs
│   │   │   ├── data.json
│   │   │   └── ...
│   │   ├── auth.py            # Authentication logic
│   │   ├── chatbot.py         # Core chatbot logic
│   │   ├── config.py          # App configurations
│   │   ├── database.py        # DB interactions
│   │   ├── google_oauth.py    # Google OAuth handling
│   │   ├── main.py            # App entry point
│   │   ├── routes.py          # API routes
│   │   ├── security.py        # Security utils
│   │   └── Users.db           # SQLite database
│
└── chroma_index/              # Vector DB index
```

---

## 🛠 Tech Stack

**Frontend:**
- React.js
- Flowbite-React (UI components)
- TailwindCSS

**Backend:**
- Python FastAPI
- ChromaDB (Vector Store)
- SQLite

**AI & NLP:**
- Langchain: for RAG functionalities
- Gemini API: for generating sentences from the retrieved embeddings

**Authentication:**
- Google OAuth 2.0
- JWT-based session management

---

## 🚀 Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/RohanCoderIIITB/BotBhaiya.git
cd BotBhaiya
```
### 2️⃣ Set up environment variables by making a .env file and filling the following information: Get your Gemini API Key here: https://aistudio.google.com/app/apikey
```bash
GOOGLE_API_KEY = YOUR_GEMINI_API
```

### 3️⃣ Backend Setup
```bash
cd BackEnd
pip install -r requirements.txt
fastapi dev app/main.py
```

### 4️⃣ Frontend Setup
```bash
cd FrontEnd
npm install
npm start
```

---

## 📸 Screenshots



---

## ⚔️ Challenges Faced
- Getting reliable and up-to-date sources about IIITB(syllabus changes, event details etc.)
- Optimizing the system for faster response times.
- Finding the right chunk size and overlap to preserve context while enabling precise retrieval.
- Selecting an embedding model that delivers high-quality, domain-specific retrievals.
- Tuning retrieval parameters to return the most relevant documents without noise.
- Preventing the LLM from inventing information by clearly separating doc-based answers from general advice.

## 💡 Future Enhancements
- Support for multimodal inputs (images, audio, video) to enhance interaction capabilities.
- Real-time collaborative chat allowing multiple users to interact simultaneously.
- Personalized user profiles with memory to retain preferences and past conversations.
- Advanced contextual reasoning with improved summarization of long texts and chats.
- Integration with external APIs and services for added functionality (e.g., calendars, weather, code repositories).

---

## 📜 License
This project is licensed under the MIT License.
