import os
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
groq_api_key = os.getenv("groq_api_key")

router = APIRouter()

# groq client
client = Groq(api_key=groq_api_key)

DEFAULT_MODEL = 'Llama3-8b-8192'

@router.post("/api/chat")
async def chat(request: Request):
    body = await request.json()
    user_input = body.get("query", "")
    if not user_input.strip():
        return JSONResponse(status_code=400, content={"error": "Query cannot be empty."})
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": user_input,
                }
            ],
            model=DEFAULT_MODEL,
        )
        response = chat_completion.choices[0].message.content
        return JSONResponse(content={
            "query": user_input,
            "response": response,
            "model": DEFAULT_MODEL
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
