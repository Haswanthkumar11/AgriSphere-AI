"""
AgriSphere AI — Companion Tool Registry Subsystem
=================================================
Implements Tool Registry pattern for Agentic AI Assistant:
- WeatherTool: Live OpenWeatherMap weather & 48h forecast
- MarketplaceTool: Equipment listings & rental status
- CropTool: Recent crop leaf scans & disease history
- ProfileTool: Farmer profile, crop type & location
- BookingTool: Rental booking requests
- NavigationTool: Application routing actions
- GovernmentTool: PMFBY insurance & SDRF input subsidies
"""
import logging
from sqlalchemy import text
from sqlalchemy.orm import Session
from ...services.weather_service import get_current_weather, get_weather_forecast

logger = logging.getLogger("agrisphere.ai.tool_registry")


class WeatherTool:
    @staticmethod
    def execute(city: str = "Tirupati", crop: str = "Paddy") -> dict:
        try:
            curr = get_current_weather(city, crop)
            fore = get_weather_forecast(city)
            return {
                "city": city,
                "crop": crop,
                "current_temp": curr.get("temp_c"),
                "humidity": curr.get("humidity"),
                "rain_prob": curr.get("rain_probability"),
                "description": curr.get("description"),
                "impact_summary": curr.get("impact_48h", {}).get("summary"),
                "action_points": curr.get("impact_48h", {}).get("action_points", []),
                "forecast_days": fore.get("forecast", [])[:3] if isinstance(fore, dict) else [],
            }
        except Exception as e:
            logger.error(f"WeatherTool error: {e}")
            return {"city": city, "status": "unavailable"}


class MarketplaceTool:
    @staticmethod
    def execute(db: Session, category: str | None = None) -> list[dict]:
        try:
            sql = "SELECT id, name, category, price_per_day, village, is_available FROM equipment WHERE is_available = true ORDER BY created_at DESC LIMIT 5;"
            rows = db.execute(text(sql)).fetchall()
            return [
                {
                    "id": r[0],
                    "name": r[1],
                    "category": r[2],
                    "price_per_day": r[3],
                    "village": r[4],
                    "is_available": r[5],
                }
                for r in rows
            ]
        except Exception as e:
            logger.error(f"MarketplaceTool error: {e}")
            return []


class CropTool:
    @staticmethod
    def execute(db: Session, user_id: str = "usr_demo") -> list[dict]:
        try:
            sql = "SELECT session_id, crop_type, disease_name, healthy, severity, confidence_pct, date FROM ai_sessions WHERE user_id = :u ORDER BY date DESC LIMIT 3;"
            rows = db.execute(text(sql), {"u": user_id}).fetchall()
            return [
                {
                    "session_id": r[0],
                    "crop_type": r[1],
                    "disease_name": r[2],
                    "healthy": r[3],
                    "severity": r[4],
                    "confidence_pct": r[5],
                    "date": str(r[6]),
                }
                for r in rows
            ]
        except Exception as e:
            logger.error(f"CropTool error: {e}")
            return []


class ProfileTool:
    @staticmethod
    def execute(db: Session, user_id: str = "usr_demo") -> dict:
        try:
            sql = """
            SELECT p.full_name, p.role, f.crop_type, f.land_size, f.district
            FROM user_profiles p
            LEFT JOIN farmers f ON p.user_id = f.user_id
            WHERE p.user_id = :u;
            """
            row = db.execute(text(sql), {"u": user_id}).fetchone()
            if row:
                return {
                    "name": row[0],
                    "role": row[1],
                    "crop_type": row[2] or "Paddy",
                    "land_size_acres": row[3] or 1.0,
                    "district": row[4] or "Tirupati",
                }
        except Exception as e:
            logger.error(f"ProfileTool error: {e}")
        return {"name": "Farmer Nikhil", "crop_type": "Paddy", "district": "Tirupati"}


class NavigationTool:
    ROUTES = {
        "scan": "/scan",
        "weather": "/weather",
        "equipment": "/equipment",
        "market": "/market",
        "grain": "/grain",
        "profile": "/profile",
        "history": "/crop/history",
    }

    @classmethod
    def get_route(cls, target: str) -> str:
        return cls.ROUTES.get(target.lower(), "/dashboard")


class GovernmentTool:
    @staticmethod
    def get_schemes() -> list[dict]:
        return [
            {
                "scheme_name": "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
                "coverage": "Up to 80% crop damage insurance payout for severe weather and disease outbreaks.",
                "claim_window": "Report crop damage within 72 hours of occurrence.",
            },
            {
                "scheme_name": "SDRF Input Subsidy Relief",
                "coverage": "₹17,000 per hectare input subsidy for flooded or submergence affected crops.",
                "eligibility": "Small and marginal farmers holding verified land records.",
            },
        ]


class ToolRegistry:
    """Central Tool Registry for AgriSphere Companion agentic execution."""
    @classmethod
    def dispatch(cls, intent: str, db: Session, city: str = "Tirupati", crop: str = "Paddy", user_id: str = "usr_demo") -> dict:
        logger.info(f"ToolRegistry dispatching intent '{intent}' for user '{user_id}'")
        context = {
            "profile": ProfileTool.execute(db, user_id),
            "weather": WeatherTool.execute(city, crop),
            "schemes": GovernmentTool.get_schemes(),
        }

        if intent in ["weather", "irrigation", "pesticide"]:
            context["focus_data"] = context["weather"]
        elif intent in ["crop_scan", "crop_health", "previous_scan"]:
            context["recent_scans"] = CropTool.execute(db, user_id)
        elif intent in ["marketplace", "equipment", "tractor"]:
            context["equipment_listings"] = MarketplaceTool.execute(db)
        
        return context
