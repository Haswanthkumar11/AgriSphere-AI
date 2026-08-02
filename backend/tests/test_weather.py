"""
AgriSphere AI — Backend Test Suite for Live Weather Module
Tests:
- GET /api/v1/weather/current
- GET /api/v1/weather/forecast
- GET /api/v1/weather/alerts
- Weather Alert generation rules
- In-memory caching mechanism
- Crop-aware AI recommendation synthesis
"""

import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.main import app
from app.services import weather_service

client = TestClient(app)


class TestLiveWeatherModule(unittest.TestCase):

    def test_get_current_weather_endpoint(self):
        """Test GET /api/v1/weather/current endpoint returns valid weather structure."""
        response = client.get("/api/v1/weather/current?city=Tirupati&crop=Paddy")
        self.assertEqual(response.status_code, 200)

        json_data = response.json()
        self.assertTrue(json_data.get("success"))
        data = json_data.get("data", {})

        self.assertIn("city", data)
        self.assertIn("temp_c", data)
        self.assertIn("feels_like_c", data)
        self.assertIn("humidity_pct", data)
        self.assertIn("wind_speed_kmh", data)
        self.assertIn("pressure_hpa", data)
        self.assertIn("rain_probability_pct", data)
        self.assertIn("description", data)
        self.assertIn("icon", data)
        self.assertIn("icon_url", data)
        self.assertIn("alerts", data)
        self.assertIn("ai_advice", data)

        # Check crop-aware advice structure
        ai_advice = data["ai_advice"]
        self.assertEqual(ai_advice.get("crop_type"), "Paddy")
        self.assertIn("recommendation", ai_advice)
        self.assertIn("impact_48h", ai_advice)
        self.assertIn("summary", ai_advice["impact_48h"])
        self.assertIn("actions", ai_advice["impact_48h"])

    def test_get_weather_forecast_endpoint(self):
        """Test GET /api/v1/weather/forecast endpoint returns 5-day forecast."""
        response = client.get("/api/v1/weather/forecast?city=Vijayawada")
        self.assertEqual(response.status_code, 200)

        json_data = response.json()
        self.assertTrue(json_data.get("success"))
        data = json_data.get("data", {})

        self.assertEqual(data.get("city"), "Vijayawada")
        forecast = data.get("forecast", [])
        self.assertGreaterEqual(len(forecast), 5)

        first_day = forecast[0]
        self.assertIn("day_name", first_day)
        self.assertIn("temp_min_c", first_day)
        self.assertIn("temp_max_c", first_day)
        self.assertIn("rain_probability_pct", first_day)
        self.assertIn("icon_url", first_day)

    def test_get_weather_alerts_endpoint(self):
        """Test GET /api/v1/weather/alerts endpoint returns active alerts."""
        response = client.get("/api/v1/weather/alerts?city=Visakhapatnam")
        self.assertEqual(response.status_code, 200)

        json_data = response.json()
        self.assertTrue(json_data.get("success"))
        data = json_data.get("data", {})
        self.assertIn("alerts", data)

    def test_weather_caching(self):
        """Test that weather service returns cached data on duplicate queries."""
        # Query 1
        d1 = weather_service.get_current_weather("Guntur", "Tomato")
        # Query 2 (should hit cache)
        d2 = weather_service.get_current_weather("Guntur", "Tomato")

        self.assertEqual(d1["city"], d2["city"])
        self.assertEqual(d1["updated_at"], d2["updated_at"])

    def test_weather_alerts_logic(self):
        """Test weather alerts generator triggers appropriate alert banners."""
        # Heavy rain test
        alerts = weather_service.generate_weather_alerts(
            temp_c=28.0, feels_like_c=31.0, humidity_pct=85, wind_kmh=12.0, rain_prob_pct=75, condition="Heavy Rain"
        )
        alert_types = [a["type"] for a in alerts]
        self.assertIn("HEAVY_RAIN", alert_types)

        # Heatwave test
        alerts_heat = weather_service.generate_weather_alerts(
            temp_c=38.0, feels_like_c=42.0, humidity_pct=45, wind_kmh=10.0, rain_prob_pct=10, condition="Clear Sky"
        )
        alert_types_heat = [a["type"] for a in alerts_heat]
        self.assertIn("HEAT_WAVE", alert_types_heat)

        # Strong wind test
        alerts_wind = weather_service.generate_weather_alerts(
            temp_c=30.0, feels_like_c=33.0, humidity_pct=50, wind_kmh=25.0, rain_prob_pct=10, condition="Windy"
        )
        alert_types_wind = [a["type"] for a in alerts_wind]
        self.assertIn("STRONG_WIND", alert_types_wind)

    def test_crop_aware_recommendation(self):
        """Test crop aware advice generates crop specific recommendations."""
        weather_info = {
            "city": "Anantapur",
            "temp_c": 36.0,
            "feels_like_c": 39.0,
            "humidity_pct": 40,
            "wind_speed_kmh": 12.0,
            "rain_probability_pct": 10,
            "description": "Clear Sky"
        }
        advice_tomato = weather_service.generate_crop_aware_ai_advice(weather_info, "Tomato")
        self.assertEqual(advice_tomato["crop_type"], "Tomato")
        self.assertIn("tomato", advice_tomato["recommendation"].lower())

        advice_paddy = weather_service.generate_crop_aware_ai_advice(weather_info, "Paddy")
        self.assertEqual(advice_paddy["crop_type"], "Paddy")
        self.assertIn("paddy", advice_paddy["recommendation"].lower())



if __name__ == "__main__":
    unittest.main()
