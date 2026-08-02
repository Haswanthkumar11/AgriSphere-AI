"""
AgriSphere AI — Live Weather Service (Module 2 / Weather Gateway)

Features:
1. OpenWeatherMap API integration (Current & 5-Day Forecast).
2. 10-Minute TTL in-memory caching per city/crop.
3. Weather Alert Generator (Heavy Rain, Heatwave, Strong Wind, High Humidity).
4. Gemini Crop-Aware AI Advice Engine (Combines weather metrics + farmer's crop type).
5. Graceful fallback data generation if external API key is missing or calls fail.
"""

import time
import logging
import requests
from datetime import datetime, timedelta
from typing import Dict, Any, List

from ..core.config import settings

logger = logging.getLogger("agrisphere.services.weather")

# In-Memory Cache: { cache_key: (timestamp, data) }
# Cache TTL: 600 seconds (10 minutes)
_CACHE: Dict[str, tuple[float, Any]] = {}
CACHE_TTL = 600

# Popular agricultural cities reference coordinates & baseline climate data for fallback
CITY_BASELINES: Dict[str, Dict[str, Any]] = {
    "tirupati": {"name": "Tirupati", "country": "IN", "temp": 33.5, "humidity": 62, "wind": 14.0, "pressure": 1012, "desc": "Partly Cloudy", "icon": "02d"},
    "vijayawada": {"name": "Vijayawada", "country": "IN", "temp": 35.0, "humidity": 70, "wind": 12.5, "pressure": 1008, "desc": "Sunny & Humid", "icon": "01d"},
    "visakhapatnam": {"name": "Visakhapatnam", "country": "IN", "temp": 31.0, "humidity": 78, "wind": 18.2, "pressure": 1010, "desc": "Coastal Breeze", "icon": "03d"},
    "hyderabad": {"name": "Hyderabad", "country": "IN", "temp": 32.0, "humidity": 55, "wind": 15.0, "pressure": 1014, "desc": "Scattered Clouds", "icon": "03d"},
    "anantapur": {"name": "Anantapur", "country": "IN", "temp": 37.2, "humidity": 45, "wind": 16.5, "pressure": 1009, "desc": "Hot & Clear", "icon": "01d"},
    "kurnool": {"name": "Kurnool", "country": "IN", "temp": 36.5, "humidity": 48, "wind": 13.8, "pressure": 1011, "desc": "Warm & Dry", "icon": "01d"},
    "guntur": {"name": "Guntur", "country": "IN", "temp": 34.2, "humidity": 68, "wind": 11.4, "pressure": 1010, "desc": "Light Rain Showers", "icon": "10d"},
    "bengaluru": {"name": "Bengaluru", "country": "IN", "temp": 27.5, "humidity": 65, "wind": 17.0, "pressure": 1016, "desc": "Pleasant Breeze", "icon": "02d"},
    "chennai": {"name": "Chennai", "country": "IN", "temp": 34.8, "humidity": 75, "wind": 19.5, "pressure": 1009, "desc": "Humid & Sunny", "icon": "01d"},
    "delhi": {"name": "Delhi", "country": "IN", "temp": 36.0, "humidity": 50, "wind": 10.2, "pressure": 1007, "desc": "Clear Sky", "icon": "01d"},
    "mumbai": {"name": "Mumbai", "country": "IN", "temp": 30.5, "humidity": 82, "wind": 21.0, "pressure": 1011, "desc": "Passing Showers", "icon": "09d"},
}


def _get_cached_data(key: str) -> Any | None:
    if key in _CACHE:
        ts, data = _CACHE[key]
        if time.time() - ts < CACHE_TTL:
            logger.info(f"Weather cache hit for key '{key}'")
            return data
        else:
            del _CACHE[key]
    return None


def _set_cached_data(key: str, data: Any) -> None:
    _CACHE[key] = (time.time(), data)


def get_weather_icon_url(icon_code: str) -> str:
    """Returns the official OpenWeatherMap icon image URL."""
    if not icon_code:
        icon_code = "02d"
    return f"https://openweathermap.org/img/wn/{icon_code}@2x.png"


def generate_weather_alerts(temp_c: float, feels_like_c: float, humidity_pct: float, wind_kmh: float, rain_prob_pct: float, condition: str) -> List[Dict[str, Any]]:
    """Evaluates live weather metrics to generate relevant farming alerts."""
    alerts = []
    cond_lower = (condition or "").lower()

    # 1. Heavy Rain Alert
    if rain_prob_pct >= 60 or "heavy rain" in cond_lower or "thunderstorm" in cond_lower or "downpour" in cond_lower:
        alerts.append({
            "type": "HEAVY_RAIN",
            "severity": "warning",
            "icon": "🌧️",
            "title": "Heavy Rain Alert",
            "description": f"Rain probability is {rain_prob_pct}% with likelihood of heavy precipitation.",
            "suggested_action": "Delay irrigation and avoid fertilizer or pesticide spraying."
        })
    elif rain_prob_pct >= 35 or "rain" in cond_lower or "shower" in cond_lower:
        alerts.append({
            "type": "MODERATE_RAIN",
            "severity": "info",
            "icon": "🌦️",
            "title": "Rain Expected",
            "description": f"Chance of rain is {rain_prob_pct}%. Field soil moisture will increase.",
            "suggested_action": "Hold off on scheduled manual watering until rainfall completes."
        })

    # 2. Heat Wave Alert
    if temp_c >= 35.0 or feels_like_c >= 38.0:
        alerts.append({
            "type": "HEAT_WAVE",
            "severity": "danger",
            "icon": "🌡️",
            "title": "Heat Wave Alert",
            "description": f"High temperatures recorded ({temp_c}°C, feels like {feels_like_c}°C). Rapid moisture loss expected.",
            "suggested_action": "Increase irrigation frequency and monitor crop moisture closely during afternoon hours."
        })

    # 3. Strong Wind Alert
    if wind_kmh >= 20.0:
        alerts.append({
            "type": "STRONG_WIND",
            "severity": "warning",
            "icon": "💨",
            "title": "Strong Wind Alert",
            "description": f"Sustained wind speed is {wind_kmh} km/h. Risk of equipment drift and crop lodging.",
            "suggested_action": "Secure lightweight equipment, stake tall crops, and postpone pesticide spraying."
        })

    # 4. High Humidity (Fungal Risk)
    if humidity_pct >= 75.0 and temp_c >= 22.0:
        alerts.append({
            "type": "HIGH_HUMIDITY",
            "severity": "info",
            "icon": "⚠️",
            "title": "High Humidity (Fungal Risk)",
            "description": f"Humidity is at {humidity_pct}%. Warm humid conditions favor fungal pathogens like leaf blight and rust.",
            "suggested_action": "Ensure proper field drainage and inspect leaf undersides for fungal spores."
        })

    return alerts


def generate_crop_aware_ai_advice(weather: Dict[str, Any], crop_type: str = "Paddy") -> Dict[str, Any]:
    """
    Generates crop-aware advisory using Gemini API when available,
    falling back to a structured ICAR crop-weather advisory.
    """
    crop = (crop_type or "Paddy").strip().title()
    city = weather.get("city", "Tirupati")
    temp = weather.get("temp_c", 30.0)
    feels_like = weather.get("feels_like_c", temp + 3)
    humidity = weather.get("humidity_pct", 60)
    wind = weather.get("wind_speed_kmh", 12.0)
    rain_prob = weather.get("rain_probability_pct", 20)
    desc = weather.get("description", "Partly Cloudy")

    gemini_key = settings.GEMINI_API_KEY
    explanation = None
    is_gemini = False

    if gemini_key:
        prompt = (
            f"You are an agricultural expert for Indian farmers. "
            f"Live weather for {city}: Temperature {temp}°C (feels like {feels_like}°C), "
            f"Humidity {humidity}%, Wind {wind} km/h, Rain chance {rain_prob}%, Condition: '{desc}'. "
            f"The farmer is growing {crop}. "
            f"Provide a concise, practical 2-sentence farming recommendation specifically for {crop} under these exact weather conditions."
        )
        for model in ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-flash-latest"]:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={gemini_key}"
                resp = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=5.0)
                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts and "text" in parts[0]:
                            explanation = parts[0]["text"].strip()
                            is_gemini = True
                            break
            except Exception as ex:
                logger.warning(f"Gemini advice API call to {model} failed: {ex}")

    if not explanation:
        # Structured ICAR Crop-Weather Fallback Synthesizer
        if rain_prob >= 60 or "rain" in desc.lower():
            if crop in ["Paddy", "Rice"]:
                explanation = f"Paddy fields in {city} may experience waterlogging under rainfall ({rain_prob}% chance). Ensure proper drainage channels are clear and inspect for sheath blight post-rain."
            elif crop == "Tomato":
                explanation = f"Rainy conditions in {city} increase Early/Late Blight vulnerability in Tomato plants. Delay foliar spray and clear excess soil water immediately."
            elif crop in ["Cotton", "Maize"]:
                explanation = f"Expected rains ({rain_prob}%) can loosen soil around {crop} roots. Ensure field bunds are intact and avoid applying granular fertilizers today."
            else:
                explanation = f"Heavy rain forecast ({rain_prob}%) for {city}. Hold off on irrigation and fertilizer application for your {crop} crop."
        elif temp >= 34.0:
            if crop in ["Paddy", "Rice"]:
                explanation = f"High temperatures ({temp}°C) in {city} accelerate water evaporation in Paddy fields. Maintain a 3–5 cm water layer to protect young tillers from heat stress."
            elif crop == "Tomato":
                explanation = f"Elevated temperature ({temp}°C) may cause blossom drop in Tomato crops. Irrigate early in the morning and monitor for moisture stress."
            elif crop == "Chilli":
                explanation = f"Warm conditions ({temp}°C) increase leaf curl thrips activity on Chilli crops. Ensure adequate root hydration and inspect shoot tips."
            else:
                explanation = f"High temperature ({temp}°C) recorded in {city}. Increase irrigation frequency for {crop} and monitor soil moisture closely."
        elif wind >= 20.0:
            explanation = f"Strong winds ({wind} km/h) in {city} can cause lodging in tall {crop} crops. Postpone pesticide spraying to prevent chemical drift."
        elif humidity >= 75:
            explanation = f"High humidity ({humidity}%) in {city} creates a high-risk environment for fungal infections in {crop}. Monitor leaf undersides and ensure field ventilation."
        else:
            explanation = f"Favorable weather conditions ({temp}°C, {desc}) in {city} for {crop}. Proceed with standard cultivation, weeding, and nutrient management."

    # Generate Next 48-Hour AI Impact Summary & Action Bullets
    if rain_prob >= 60 or "rain" in desc.lower():
        impact_summary = f"Heavy rainfall expected over the next 48 hours in {city}."
        actions_48h = [
            f"Delay fertilizer application on your {crop} field.",
            "Monitor field drainage channels to prevent waterlogging.",
            f"Inspect {crop} crops for fungal infections after rainfall completes."
        ]
    elif temp >= 35.0:
        impact_summary = f"Heatwave conditions forecast over the next 48 hours in {city}."
        actions_48h = [
            f"Increase irrigation frequency for {crop} during early morning or late evening.",
            "Apply organic mulch around plant bases to retain soil moisture.",
            f"Monitor {crop} leaves for heat stress and wilting."
        ]
    elif wind >= 20.0:
        impact_summary = f"Strong gusty winds anticipated over the next 48 hours in {city}."
        actions_48h = [
            "Postpone all pesticide/herbicide spraying to avoid chemical drift.",
            f"Reinforce stakes and supports for tall {crop} plants.",
            "Secure lightweight farm machinery and protective covers."
        ]
    elif humidity >= 75.0:
        impact_summary = f"Elevated humidity and high fungal disease risk over the next 48 hours in {city}."
        actions_48h = [
            f"Inspect undersides of {crop} leaves for early fungal spores (blight/rust).",
            "Ensure proper field drainage and air circulation between rows.",
            "Prepare preventive bio-fungicide if high moisture continues."
        ]
    else:
        impact_summary = f"Stable, favorable agricultural weather expected over the next 48 hours in {city}."
        actions_48h = [
            f"Proceed with scheduled weeding and crop maintenance for {crop}.",
            "Maintain regular soil moisture check routines.",
            "Plan upcoming harvest or foliar applications under clear weather."
        ]

    return {
        "crop_type": crop,
        "recommendation": explanation,
        "impact_48h": {
            "summary": impact_summary,
            "actions": actions_48h
        },
        "is_gemini_generated": is_gemini,
        "category": "urgent" if (rain_prob >= 60 or temp >= 35 or wind >= 20) else "normal"
    }


def _fetch_live_openweathermap_current(city: str) -> Dict[str, Any] | None:
    """Queries OpenWeatherMap current weather API endpoint."""
    api_key = settings.OPENWEATHERMAP_API_KEY
    if not api_key:
        return None

    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={requests.utils.quote(city)}&units=metric&appid={api_key}"
        resp = requests.get(url, timeout=5.0)
        if resp.status_code == 200:
            d = resp.json()
            main = d.get("main", {})
            wind = d.get("wind", {})
            weather_arr = d.get("weather", [{}])
            w0 = weather_arr[0] if weather_arr else {}
            rain = d.get("rain", {})
            rain_1h = rain.get("1h", 0.0)

            # Estimate rain probability if not directly in current endpoint
            rain_prob = 0
            if rain_1h > 0:
                rain_prob = min(95, int(rain_1h * 30 + 50))
            elif d.get("clouds", {}).get("all", 0) > 70:
                rain_prob = 40
            elif d.get("clouds", {}).get("all", 0) > 40:
                rain_prob = 20

            icon_code = w0.get("icon", "02d")
            now = datetime.now()
            return {
                "city": d.get("name", city.title()),
                "country": d.get("sys", {}).get("country", "IN"),
                "temp_c": round(main.get("temp", 30.0), 1),
                "feels_like_c": round(main.get("feels_like", 33.0), 1),
                "humidity_pct": int(main.get("humidity", 60)),
                "pressure_hpa": int(main.get("pressure", 1012)),
                "wind_speed_ms": round(wind.get("speed", 4.0), 1),
                "wind_speed_kmh": round(wind.get("speed", 4.0) * 3.6, 1),
                "rain_probability_pct": rain_prob,
                "description": w0.get("description", "Partly Cloudy").title(),
                "icon": icon_code,
                "icon_url": get_weather_icon_url(icon_code),
                "is_live": True,
                "status_label": "🟢 LIVE",
                "updated_time_str": now.strftime("%I:%M %p"),
                "source": "OpenWeatherMap Live API"
            }
        else:
            logger.warning(f"OpenWeatherMap returned status {resp.status_code} for city '{city}'")
    except Exception as ex:
        logger.warning(f"Failed to fetch live OpenWeatherMap data for '{city}': {ex}")

    return None


def _fetch_live_openweathermap_forecast(city: str) -> List[Dict[str, Any]] | None:
    """Queries OpenWeatherMap 5-day forecast API endpoint."""
    api_key = settings.OPENWEATHERMAP_API_KEY
    if not api_key:
        return None

    try:
        url = f"https://api.openweathermap.org/data/2.5/forecast?q={requests.utils.quote(city)}&units=metric&appid={api_key}"
        resp = requests.get(url, timeout=5.0)
        if resp.status_code == 200:
            d = resp.json()
            raw_list = d.get("list", [])

            # Aggregate 3-hourly entries into daily summaries
            daily_dict: Dict[str, List[Dict[str, Any]]] = {}
            for item in raw_list:
                dt_txt = item.get("dt_txt", "")
                date_str = dt_txt.split(" ")[0] if dt_txt else ""
                if not date_str:
                    continue
                if date_str not in daily_dict:
                    daily_dict[date_str] = []
                daily_dict[date_str].append(item)

            forecast_days = []
            for date_str, items in list(daily_dict.items())[:5]:
                try:
                    dt_obj = datetime.strptime(date_str, "%Y-%m-%d")
                    day_name = dt_obj.strftime("%A")
                    short_date = dt_obj.strftime("%b %d")
                except Exception:
                    day_name = "Today"
                    short_date = date_str

                temps = [it.get("main", {}).get("temp", 30.0) for it in items]
                feels = [it.get("main", {}).get("feels_like", 33.0) for it in items]
                humidities = [it.get("main", {}).get("humidity", 60) for it in items]
                winds = [it.get("wind", {}).get("speed", 4.0) for it in items]
                pops = [it.get("pop", 0.0) for it in items]

                # Select midday item for representative icon and description
                mid_item = items[len(items) // 2]
                w0 = mid_item.get("weather", [{}])[0]
                icon_code = w0.get("icon", "02d")

                forecast_days.append({
                    "date": date_str,
                    "day_name": day_name,
                    "short_date": short_date,
                    "temp_c": round(sum(temps) / len(temps), 1),
                    "temp_min_c": round(min(temps), 1),
                    "temp_max_c": round(max(temps), 1),
                    "feels_like_c": round(sum(feels) / len(feels), 1),
                    "humidity_pct": int(sum(humidities) / len(humidities)),
                    "wind_speed_kmh": round((sum(winds) / len(winds)) * 3.6, 1),
                    "rain_probability_pct": int(max(pops) * 100),
                    "description": w0.get("description", "Partly Cloudy").title(),
                    "icon": icon_code,
                    "icon_url": get_weather_icon_url(icon_code),
                })
            return forecast_days
    except Exception as ex:
        logger.warning(f"Failed to fetch live OpenWeatherMap forecast for '{city}': {ex}")

    return None


def _generate_fallback_current(city: str) -> Dict[str, Any]:
    """Generates realistic current weather for fallback mode."""
    c_key = city.lower().strip()
    base = CITY_BASELINES.get(c_key, {
        "name": city.title(), "country": "IN", "temp": 31.5, "humidity": 60, "wind": 13.5, "pressure": 1012, "desc": "Partly Cloudy", "icon": "02d"
    })

    # Add slight deterministic variation based on city name string
    seed = sum(ord(ch) for ch in city)
    temp_var = (seed % 5) - 2.0
    hum_var = (seed % 15) - 7
    wind_var = (seed % 7) - 3.0

    temp_c = round(base["temp"] + temp_var, 1)
    feels_like_c = round(temp_c + 3.2, 1)
    humidity_pct = max(30, min(95, base["humidity"] + hum_var))
    wind_kmh = max(5.0, round(base["wind"] + wind_var, 1))

    rain_prob = 15
    if humidity_pct > 75:
        rain_prob = 75
    elif humidity_pct > 65:
        rain_prob = 40

    icon_code = base.get("icon", "02d")
    now = datetime.now()
    return {
        "city": base["name"],
        "country": base["country"],
        "temp_c": temp_c,
        "feels_like_c": feels_like_c,
        "humidity_pct": humidity_pct,
        "pressure_hpa": base["pressure"],
        "wind_speed_ms": round(wind_kmh / 3.6, 1),
        "wind_speed_kmh": wind_kmh,
        "rain_probability_pct": rain_prob,
        "description": base["desc"],
        "icon": icon_code,
        "icon_url": get_weather_icon_url(icon_code),
        "is_live": False,
        "status_label": "🔴 Offline",
        "updated_time_str": now.strftime("%I:%M %p"),
        "source": "Live Weather Service Unavailable (Baseline Telemetry)"
    }


def _generate_fallback_forecast(city: str) -> List[Dict[str, Any]]:
    """Generates realistic 5-day forecast for fallback mode."""
    curr = _generate_fallback_current(city)
    today = datetime.now()
    forecast = []

    conditions_sequence = [
        (curr["description"], curr["icon"], curr["rain_probability_pct"]),
        ("Scattered Clouds", "03d", max(10, curr["rain_probability_pct"] - 15)),
        ("Light Rain", "10d", 65),
        ("Sunny Day", "01d", 10),
        ("Partly Cloudy", "02d", 20),
    ]

    for i in range(5):
        day_date = today + timedelta(days=i)
        desc, icon_code, rain_p = conditions_sequence[i % len(conditions_sequence)]
        temp_base = curr["temp_c"] + ((i % 3) - 1.0)

        forecast.append({
            "date": day_date.strftime("%Y-%m-%d"),
            "day_name": "Today" if i == 0 else day_date.strftime("%A"),
            "short_date": day_date.strftime("%b %d"),
            "temp_c": round(temp_base, 1),
            "temp_min_c": round(temp_base - 4.5, 1),
            "temp_max_c": round(temp_base + 3.5, 1),
            "feels_like_c": round(temp_base + 2.8, 1),
            "humidity_pct": max(35, min(90, curr["humidity_pct"] + (i * 3 - 4))),
            "wind_speed_kmh": max(6.0, round(curr["wind_speed_kmh"] + (i - 2), 1)),
            "rain_probability_pct": rain_p,
            "description": desc,
            "icon": icon_code,
            "icon_url": get_weather_icon_url(icon_code),
        })

    return forecast


def get_current_weather(city: str = "Tirupati", crop: str = "Paddy") -> Dict[str, Any]:
    """
    Main entry point for current weather data.
    Implements 10-minute cache, OpenWeatherMap API query, Weather Alerts,
    and Gemini Crop-Aware AI Advice.
    """
    clean_city = (city or "Tirupati").strip()
    clean_crop = (crop or "Paddy").strip()
    cache_key = f"curr_{clean_city.lower()}_{clean_crop.lower()}"

    cached = _get_cached_data(cache_key)
    if cached:
        return cached

    # Step 1: Fetch live or baseline weather
    weather_data = _fetch_live_openweathermap_current(clean_city)
    if not weather_data:
        weather_data = _generate_fallback_current(clean_city)

    # Step 2: Generate Weather Alerts
    alerts = generate_weather_alerts(
        temp_c=weather_data["temp_c"],
        feels_like_c=weather_data["feels_like_c"],
        humidity_pct=weather_data["humidity_pct"],
        wind_kmh=weather_data["wind_speed_kmh"],
        rain_prob_pct=weather_data["rain_probability_pct"],
        condition=weather_data["description"]
    )
    weather_data["alerts"] = alerts

    # Step 3: Generate Gemini Crop-Aware AI Advice
    ai_advice = generate_crop_aware_ai_advice(weather_data, clean_crop)
    weather_data["ai_advice"] = ai_advice
    weather_data["updated_at"] = datetime.utcnow().isoformat() + "Z"

    # Cache result for 10 minutes
    _set_cached_data(cache_key, weather_data)
    return weather_data


def get_weather_forecast(city: str = "Tirupati") -> Dict[str, Any]:
    """
    Main entry point for 5-day weather forecast.
    Implements 10-minute cache and OpenWeatherMap API query.
    """
    clean_city = (city or "Tirupati").strip()
    cache_key = f"fore_{clean_city.lower()}"

    cached = _get_cached_data(cache_key)
    if cached:
        return cached

    forecast_days = _fetch_live_openweathermap_forecast(clean_city)
    if not forecast_days:
        forecast_days = _generate_fallback_forecast(clean_city)

    result = {
        "city": clean_city.title(),
        "forecast": forecast_days,
        "updated_at": datetime.utcnow().isoformat() + "Z"
    }

    _set_cached_data(cache_key, result)
    return result


def get_weather_alerts_only(city: str = "Tirupati") -> Dict[str, Any]:
    """Standalone endpoint helper for weather alerts."""
    curr = get_current_weather(city)
    return {
        "city": curr["city"],
        "alerts": curr.get("alerts", []),
        "updated_at": curr.get("updated_at")
    }
