import os
import requests
from fastapi import APIRouter, HTTPException
from groq import Groq
from dotenv import load_dotenv

# Load API keys
load_dotenv()
groq_api_key = os.getenv("groq_api_key")
newsapi_key = os.getenv("newsapi_key")

# Groq client
client = Groq(api_key=groq_api_key)

router = APIRouter()

def extract_summary(text):
    """Extract Summary from model output"""
    lines = text.strip().split("\n")
    summary = ""
    for line in lines:
        if line.lower().startswith("summary:"):
            summary = line.split(":", 1)[1].strip()
    return summary

@router.get("/summarize_news")
def summarize_news(model: str = 'Llama3-8b-8192',
                   query: str = "cryptocurrency OR bitcoin OR ethereum",
                   language: str = "en",
                   max_articles: int = 10):
    url = f"https://newsapi.org/v2/everything?q={query}&language={language}&sortBy=publishedAt&apiKey={newsapi_key}"
    res = requests.get(url).json()
    if res.get("status") != "ok" or not res.get("articles"):
        raise HTTPException(status_code=404, detail="No financial news found or API limit exceeded.")
    results = []
    for article in res["articles"][:max_articles]:
        title = article["title"]
        content = article.get("description") or article.get("content") or title
        source = article["source"]["name"]
        prompt = f"""
Summarize the following Indian financial news in a crisp, 60-word format like the Inshorts app.

News: {content}

Return in this format:
Summary: ...
"""
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=model
        )
        result = chat_completion.choices[0].message.content if chat_completion.choices else ""
        summary = extract_summary(result)
        results.append({
            "title": title,
            "summary": summary,
            "source": source,
            "url": article.get('url', '#')
        })
    return {"results": results}
