from fastapi import APIRouter, Query, Response
from fastapi.responses import JSONResponse
import requests
import pandas as pd
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

router = APIRouter()

# API_KEY = "SjXJiXGw0yKTyDrZM_nOU8e3rKhOcqfa"  # Replace with your key
API_KEY = os.getenv("polygon_api_key")  # Replace with your key

@router.get("/api/price")
def get_crypto_price(response: Response, symbol: str = Query("X:BTCUSD"), interval: str = Query("minute")):
    response.headers["Cache-Control"] = "no-store"
    to = datetime.utcnow()
    from_ = to - timedelta(days=1)
    from_str = from_.strftime('%Y-%m-%d')
    to_str = to.strftime('%Y-%m-%d')

    url = f"https://api.polygon.io/v2/aggs/ticker/{symbol}/range/1/{interval}/{from_str}/{to_str}?apiKey={API_KEY}&limit=100"
    r = requests.get(url)
    # Debug logging
    print(f"Polygon API URL: {url}")
    print(f"Polygon API status: {r.status_code}, response: {r.text}")
    if r.status_code != 200:
        try:
            err_json = r.json()
            err_msg = err_json.get("error", r.text)
        except Exception:
            err_msg = r.text
        return JSONResponse(status_code=500, content={"error": f"Failed to fetch data from Polygon.io: {err_msg}"})
    data = r.json()
    if "results" not in data:
        return JSONResponse(status_code=404, content={"error": "No data found"})
    df = pd.DataFrame(data["results"])
    if df.empty:
        return {"data": []}
    if "t" not in df.columns:
        return JSONResponse(status_code=500, content={"error": "Timestamp column 't' missing in data."})
    df["t"] = pd.to_datetime(df["t"], unit="ms")
    df.rename(columns={"t": "time", "o": "open", "h": "high", "l": "low", "c": "close", "v": "volume"}, inplace=True)
    result = df.to_dict(orient="records")
    return {"data": result}
