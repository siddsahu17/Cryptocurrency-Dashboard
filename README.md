# README.md

## 📈 Crypto Forecasting Project
A full-stack web application to visualize, summarize, chat, and forecast cryptocurrency trends (Bitcoin) using React + Flask + ML.

---

## 🚧 Project Structure
```
project_root/
├── client/               # React frontend (converted from Figma)
│   └── (generated separately)
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

### 1. Backend (Flask)
```bash
cd server
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
```

### 2. Frontend (React)
```bash
cd client
npm install
npm start
```

### 3. Run Both Together
```bash
# From root (optional if concurrently setup)
npm install -g concurrently
concurrently "npm start --prefix client" "python server/app.py"
```

---

## ✅ Backend Endpoints

| Route              | Method | Description                          |
|-------------------|--------|--------------------------------------|
| `/api/price`      | GET    | Get live Bitcoin price chart data    |
| `/api/news`       | GET    | Summarized daily crypto news         |
| `/api/chat`       | POST   | Ask RAG chatbot a crypto question    |
| `/api/forecast`   | GET    | ARIMA-based price prediction         |

---

## 🛠 Technologies Used
- **Frontend**: React, Axios, Chart.js, Figma design
- **Backend**: Flask, Flask-CORS, Transformers, Statsmodels, Pandas
- **Models**: BART (news summarization), ARIMA (forecasting), GPT-based (chatbot)
- **Deployment**: Vercel + Render/Heroku (optional)

---

## 🔮 Future Improvements
- Real-time WebSocket charting
- LlamaIndex-powered RAG with better retrieval
- User authentication & saved insights
- Admin dashboard for ML retraining

---

## 👨‍💻 Maintainer
**Siddhant Kumar Sahu**

---

## 📜 License
MIT License
