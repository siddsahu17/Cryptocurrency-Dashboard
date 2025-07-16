# import os
# import pandas as pd
# from fastapi import APIRouter, Query, HTTPException
# from fastapi.responses import JSONResponse
# from statsmodels.tsa.arima.model import ARIMA
# 
# router = APIRouter()
# 
# DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
# SUPPORTED_SYMBOLS = [
#     'BTC-USD', 'ETH-USD', 'DOGE-USD', 'MATIC-USD', 'SOL-USD'
# ]
# 
# @router.get('/api/forecast')
# def forecast(symbol: str = Query('BTC-USD'), days: int = Query(7)):
#     if symbol not in SUPPORTED_SYMBOLS:
#         raise HTTPException(status_code=400, detail=f"Symbol '{symbol}' not supported.")
#     csv_path = os.path.join(DATA_DIR, f'{symbol}.csv')
#     if not os.path.exists(csv_path):
#         raise HTTPException(status_code=404, detail=f"CSV file for {symbol} not found.")
#     df = pd.read_csv(csv_path, parse_dates=['timestamp'])
#     df = df.sort_values('timestamp')
#     close_prices = df['close'].dropna()
#     # Fit ARIMA model (simple order, can be tuned)
#     try:
#         model = ARIMA(close_prices, order=(5,1,0))
#         model_fit = model.fit()
#         forecast = model_fit.forecast(steps=days)
#         forecast_dates = pd.date_range(df['timestamp'].iloc[-1], periods=days+1, freq='D')[1:]
#         forecast_list = [
#             {"date": str(date.date()), "forecast": float(price)}
#             for date, price in zip(forecast_dates, forecast)
#         ]
#         return JSONResponse(content={
#             "symbol": symbol,
#             "forecast": forecast_list
#         })
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Forecasting failed: {str(e)}")
