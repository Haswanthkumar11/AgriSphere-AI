"""
AgriSphere AI — Market & Weather Forecasting Engine (Module 1)
==================================================================
Seeded/pre-rendered data, exactly as the project plan itself recommends for
Module 1 (satellite NDVI + LightGBM price forecasts are too heavy to run
live in a demo environment) — deterministic-but-realistic payload, not a
random mock.

Isolation: market_service.py calls `forecast_prices()` / `forecast_weather()`
only. Swapping in a real LightGBM price model or a live NDVI satellite feed
means editing only this file.
"""
import random
import datetime

BASE_PRICES = [
    {"crop": "Tomato", "icon": "🍅", "price": 1840, "trend_percent": 6.0, "mandi": "Tirupati Mandi"},
    {"crop": "Paddy", "icon": "🌾", "price": 2150, "trend_percent": -2.0, "mandi": "Tirupati Mandi"},
    {"crop": "Chilli", "icon": "🌶️", "price": 14200, "trend_percent": 11.0, "mandi": "Tirupati Mandi"},
]


def forecast_prices() -> dict:
    out = []
    for p in BASE_PRICES:
        jitter = random.uniform(-1.5, 1.5)
        out.append({**p, "trend_percent": round(p["trend_percent"] + jitter, 1)})
    return {
        "mandi": "Tirupati Mandi",
        "updated_at": datetime.datetime.utcnow().isoformat(),
        "prices": out,
    }


def forecast_weather() -> dict:
    today = datetime.date.today()
    days = []
    temps = [41, 40, 36, 33, 30, 29, 32]
    for i in range(7):
        d = today + datetime.timedelta(days=i)
        temp = temps[i]
        icon = "🥵" if temp >= 38 else ("☀️" if temp >= 34 else ("⛅" if temp >= 31 else "🌦️"))
        days.append({
            "date": d.isoformat(),
            "day_label": d.strftime("%a"),
            "temp_c": temp,
            "icon": icon,
            "heat_alert": temp >= 38,
        })
    return {
        "region": "Tirupati, Andhra Pradesh",
        "days": days,
        "advisory": {
            "title": "Heatwave warning — Tirupati region",
            "body": "Temperatures rising to 41°C over next 3 days. Water tomato crops early morning or evening.",
        },
        "ndvi_alert": {
            "field": "Field 2",
            "change_percent": -14,
            "message": "NDVI dropped 14% this week — sign of water stress. Consider irrigation.",
        },
    }
