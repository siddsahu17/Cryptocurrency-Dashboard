from fastapi import APIRouter, Query, Response
from fastapi.responses import JSONResponse
import requests
import pandas as pd
from datetime import datetime, timedelta

router = APIRouter()

API_KEY = "Z9nJVv8cOxoaJZI55yR5ZzLQsmZaBgyn"  # Replace with your key

@router.get("/api/price")
def get_crypto_price(response: Response, symbol: str = Query("X:BTCUSD"), interval: str = Query("minute")):
    response.headers["Cache-Control"] = "no-store"
    to = datetime.utcnow()
    from_ = to - timedelta(days=1)
    from_str = from_.strftime('%Y-%m-%d')
    to_str = to.strftime('%Y-%m-%d')

    url = f"https://api.polygon.io/v2/aggs/ticker/{symbol}/range/1/{interval}/{from_str}/{to_str}?apiKey={API_KEY}&limit=100"
    r = requests.get(url)
    if r.status_code != 200:
        return JSONResponse(status_code=500, content={"error": "Failed to fetch data from Polygon.io"})
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
