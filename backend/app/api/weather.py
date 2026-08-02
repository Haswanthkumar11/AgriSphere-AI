"""
AgriSphere AI — Live Weather API Routes (Module 2 Gateway)

Endpoints:
GET /api/v1/weather/current?city=<city>&crop=<crop>
GET /api/v1/weather/forecast?city=<city>
GET /api/v1/weather/alerts?city=<city>
"""

from fastapi import APIRouter, Query
from ..core.responses import success_response
from ..services import weather_service

router = APIRouter(prefix="/api/v1/weather", tags=["weather"])


@router.get("/current")
def get_current_weather(
    city: str = Query("Tirupati", description="City or regional location"),
    region: str | None = Query(None, description="Alias for city query parameter"),
    crop: str = Query("Paddy", description="Farmer crop type for tailored AI recommendation")
):
    """
    Returns current live weather conditions, weather alert banners,
    and Gemini crop-aware AI advice for the specified city and crop.
    """
    target_city = region if (region and city == "Tirupati") else city
    data = weather_service.get_current_weather(city=target_city, crop=crop)
    return success_response(data=data)


@router.get("/forecast")
def get_weather_forecast(
    city: str = Query("Tirupati", description="City or regional location"),
    region: str | None = Query(None, description="Alias for city query parameter")
):
    """
    Returns 5-day weather forecast with daily temperature ranges,
    rain probabilities, and OpenWeatherMap icons.
    """
    target_city = region if (region and city == "Tirupati") else city
    data = weather_service.get_weather_forecast(city=target_city)
    return success_response(data=data)


@router.get("/alerts")
def get_weather_alerts(
    city: str = Query("Tirupati", description="City or regional location"),
    region: str | None = Query(None, description="Alias for city query parameter")
):
    """
    Returns active weather alerts for the specified location.
    """
    target_city = region if (region and city == "Tirupati") else city
    data = weather_service.get_weather_alerts_only(city=target_city)
    return success_response(data=data)
