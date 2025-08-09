# 🤖 BotBhaiya — Your Friendly IIITB Freshers' Assistant

**BotBhaiya** is an AI-powered campus assistant designed to answer **any kind of question a fresher might have about IIIT Bangalore** — from factual queries like *"What electives does the ECE department offer?"* to opinion-based ones like *"Any tips for surviving the first semester?"*  

It combines **accurate, sourced information** with a conversational, approachable tone — making it feel like chatting with a helpful senior.

---

## ✨ Features

- **📚 Factual Queries** — Pulls information from official IIITB documents, handbooks, and curated datasets.
- **💬 Opinion-Based Advice** — Provides guidance backed by testimonials from seniors.
- **🔐 Authentication** — User & admin login with Google OAuth support.
- **🗂 Chat History** — View past conversations.
- **⚙️ Retriever Management** — Admin panel to add/delete knowledge retrievers.
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
- Custom Retriever + LLM integration

**Authentication:**
- Google OAuth 2.0
- JWT-based session management

---

## 🚀 Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/BotBhaiya.git
cd BotBhaiya
```

### 2️⃣ Backend Setup
```bash
cd BackEnd
pip install -r requirements.txt
fastapi dev app/main.py
```

### 3️⃣ Frontend Setup
```bash
cd FrontEnd
npm install
npm start
```

---

## 📸 Screenshots



---

## 💡 Future Enhancements
- Multi-turn conversation memory
- Integration with campus events API
- Offline mode for intranet-only access
- Voice-based interaction

---

## 📜 License
This project is licensed under the MIT License.
