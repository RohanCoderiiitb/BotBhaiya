# 🤖 BotBhaiya — Your Friendly IIITB Freshers' Assistant

"Knowledge shared is knowledge squared — BotBhaiya, your trusted companion on the IIITB journey."

**BotBhaiya** is an AI-powered campus assistant designed to answer **any kind of question a fresher might have about IIIT Bangalore** — from factual queries like *"What electives does the ECE department offer?"* to opinion-based ones like *"Any tips for surviving the first semester?"*  

It combines **accurate, sourced information** with a conversational, approachable tone, making it feel like chatting with a helpful senior.

---

## 🎉 Problem Solved

As a fresher, my mind was buzzing with countless questions about academics, campus facilities, and more. Since seniors were often busy and couldn’t always respond quickly, I hesitated to bother them and ended up endlessly skimming through college documents and websites, wishing for a quick, reliable source of instant help and guidance during those first challenging weeks at IIITB.

BotBhaiya is the instant, reliable companion every fresher needs during those first few weeks at IIITB—offering quick, accurate answers about academics, campus life, and administrative processes without the need to wait on busy seniors or dig through countless documents. It also provides practical advice on managing workload and balancing studies with social life, helping freshers smoothly navigate their transition until they build connections and find their footing.

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
### 2️⃣ Set up environment variables by making a .env file and filling in the following information: Get your Gemini API Key here: https://aistudio.google.com/app/apikey
```bash
GOOGLE_API_KEY=your_google_api_key_here
USER_AGENT=Mozilla/5.0
PERSIST_DIR=./chroma_index
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
ADMIN_USERNAME=admin@BotBhaiya
ADMIN_PASSWORD=your_secure_password_here
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

## ⚙️ Implementation
1. Used the Gemini API to generate sentences from the given context in the documents.
2. The data directory in the backend contains relevant data used for indexing
3. The chroma-index folder stores the vector embeddings for the chunks of information retrieved from the documents
4. chatbot.py - is the core chatbot logic that creates vector embeddings and makes API calls to Gemini
   
   <img width="672" height="335" alt="image" src="https://github.com/user-attachments/assets/f06a0f32-34e4-446b-a37c-6e37e6dd51bb" />
   
   Credits: freecodecamp.org

---

# 📡 API Endpoints

## **Indexing & Upload**
| Method | Endpoint            | Auth Required | Description |
|--------|--------------------|--------------|-------------|
| **POST** | `/indexing` | Admin | Index documents from a list of URLs into the knowledge base. |
| **POST** | `/upload` | Admin | Upload file(s) to `./app/Data` for processing. |
| **POST** | `/delete-retriever` | Admin | Delete the current Chroma retriever data. |

---

## **Chat**
| Method | Endpoint            | Auth Required | Description |
|--------|--------------------|--------------|-------------|
| **POST** | `/chat` | User | Ask a question to the chatbot. Returns generated answer + sources. |

---

## **Chat History**
| Method | Endpoint            | Auth Required | Description |
|--------|--------------------|--------------|-------------|
| **GET** | `/admin/chat_history` | Admin | Retrieve all users’ chat histories. |
| **GET** | `/user/chat_history` | User | Retrieve the current user’s chat history. |

---

## **User Authentication**
| Method | Endpoint            | Auth Required | Description |
|--------|--------------------|--------------|-------------|
| **POST** | `/usersignup` | None | Register a new user. |
| **POST** | `/userlogin` | None | Log in as a user and get a JWT token. |
| **POST** | `/adminlogin` | None | Log in as admin and get a JWT token. |

---

## **Google OAuth**
| Method | Endpoint            | Auth Required | Description |
|--------|--------------------|--------------|-------------|
| **GET** | `/auth/google/login` | None | Redirect to Google login page. |
| **GET** | `/auth/google/callback` | None | Handle Google OAuth callback and generate JWT token. |


---

## 📸 Screenshots

### 🧑‍🎓 Freshers’ FAQs
<img width="1898" height="822" alt="image" src="https://github.com/user-attachments/assets/9192e2ae-b93e-4c7b-a28a-2534b039870f" />

<br>
<img width="1898" height="822" alt="Screenshot 2025-08-12 230255" src="https://github.com/user-attachments/assets/212e65ff-53d7-436d-b32b-fcd83eefff1b" />

<br>
<img width="1887" height="818" alt="Screenshot 2025-08-12 230616" src="https://github.com/user-attachments/assets/869c7e2a-ed61-4ad7-884e-bc097ff279bc" />

<br>
<img width="1919" height="821" alt="Screenshot 2025-08-12 230709" src="https://github.com/user-attachments/assets/3b20c170-430b-4789-a92c-70fd98ef93a0" />

<br>
<img width="1885" height="818" alt="Screenshot 2025-08-12 230732" src="https://github.com/user-attachments/assets/4d97c14e-9f18-41cf-8931-ec46842072aa" />

### 🏛️ Some Admin Privileges
<br>
<img width="1880" height="783" alt="image" src="https://github.com/user-attachments/assets/a3163326-c7d0-4acd-ab02-f63d2be111e2" />
<br>
<img width="1853" height="819" alt="image" src="https://github.com/user-attachments/assets/3870e9d2-16cd-43fb-b7b2-b1128126750c" />

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
