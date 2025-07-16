# 📈 Crypto Dashboard Project
A full-stack web application to visualize, summarize, and chat about cryptocurrency trends using React + FastAPI.

---

## 🚧 Project Structure
```
project_root/
├── client/               # React frontend (dashboard UI)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Chatbot.jsx
│   │   ├── App.css
│   │   ├── Chatbot.css
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── assets/
│   ├── public/
│   │   └── vite.svg
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
├── server/
│   ├── app.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── price.py
│   │   ├── news.py
│   │   ├── chat.py
│   │   └── forecast.py
│   ├── requirements.txt
│   └── utils/
│       └── summarizer.py
└── README.md
```

---

## 🔧 Setup Instructions

### 1. Backend (FastAPI)
```bash
cd server
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload
```

### 2. Frontend (React)
```bash
cd client
npm install
npm run dev
```

### 3. Run Both Together (in separate terminals)
```bash
# Terminal 1 (Backend)
cd server
uvicorn app:app --reload

# Terminal 2 (Frontend)
cd client
npm run dev
```

---

## ✅ Backend Endpoints

| Route                | Method | Description                          |
|----------------------|--------|--------------------------------------|
| `/api/price`         | GET    | Get live crypto price chart data     |
| `/summarize_news`    | GET    | Summarized daily crypto news         |
| `/api/chat`          | POST   | Ask ROBO chatbot a crypto question   |
| `/api/forecast`      | GET    | ARIMA-based price prediction *(disabled)* |

---

## 🛠 Technologies Used
- **Frontend**: React, Plotly.js, react-plotly.js, Vite
- **Backend**: FastAPI, Uvicorn, Pandas, Requests, LangChain, OpenAI, Pinecone, python-dotenv
- **Chatbot**: Groq API (Llama3-8b-8192)
- **News**: NewsAPI, Groq summarization, static images

---

## 🚀 Features & Outcomes
- **Cryptocurrency Dashboard**: Modern, static dashboard UI for crypto data
- **Price Visualization**: Interactive candlestick charts for multiple cryptocurrencies
- **News Summarization**: Latest crypto news with AI-powered summaries and images
- **ROBO Chatbot**: Bottom-right assistant for crypto Q&A
- **Responsive Design**: Clean, non-overlapping layout

---

## 🔮 Future Improvements
- Enable and enhance ARIMA-based forecasting
- Real-time WebSocket charting
- Improved RAG retrieval for chatbot
- User authentication & saved insights
- Admin dashboard for ML retraining

---

## 👨‍💻 Maintainer
**Siddhant Kumar Sahu**

---

## 📜 License
MIT License
