"""
AgriSphere AI — Companion Service & Reasoning Orchestrator
===========================================================
Executes agentic AI workflow for AgriSphere Companion:
1. Intent Classification
2. Tool Registry Dispatch
3. Context Building
4. Gemini 2.5 Flash Prompt Synthesis
5. Standardized JSON Response Formatting
"""
import json
import logging
import requests
from sqlalchemy.orm import Session
from ..core.config import settings
from ..ai.tools.tool_registry import ToolRegistry, NavigationTool

logger = logging.getLogger("agrisphere.companion_service")


def classify_intent(message: str) -> str:
    msg = message.lower()
    if any(w in msg for w in ["rain", "temp", "weather", "forecast", "cloud", "sun", "hot", "climate"]):
        return "weather"
    elif any(w in msg for w in ["scan", "leaf", "disease", "spot", "blight", "fungus", "camera", "diagnose"]):
        return "crop_scan"
    elif any(w in msg for w in ["tractor", "rent", "equipment", "machinery", "rotavator", "harvester", "tool"]):
        return "marketplace"
    elif any(w in msg for w in ["price", "market", "mandi", "rate", "sell", "cost"]):
        return "market_prices"
    elif any(w in msg for w in ["scheme", "pmfby", "sdrf", "government", "subsidy", "insurance"]):
        return "government_schemes"
    elif any(w in msg for w in ["irrigate", "water", "drain", "fertilizer", "spray", "pesticide"]):
        return "farming_advice"
    elif any(w in msg for w in ["profile", "land", "crop", "account"]):
        return "profile"
    elif any(w in msg for w in ["take me", "open", "show", "go to", "navigate"]):
        return "navigation"
    return "general_farming"


def process_companion_chat(
    db: Session,
    message: str,
    crop_type: str = "Paddy",
    city: str = "Tirupati",
    user_id: str = "usr_demo",
    language: str = "en",
) -> dict:
    """
    Main Agentic AI pipeline for AgriSphere Companion.
    """
    logger.info(f"Processing Companion Chat: '{message}' (user='{user_id}', crop='{crop_type}', city='{city}')")
    
    # 1. Intent Router
    intent = classify_intent(message)
    logger.info(f"Intent classified: '{intent}'")

    # 2. Tool Registry Execution
    tools_context = ToolRegistry.dispatch(intent, db, city=city, crop=crop_type, user_id=user_id)

    # 3. Pipeline Execution Steps Logging
    pipeline_steps = [
        "Understanding Question",
        "Selecting Specialized Tools",
        "Loading Farmer Profile & Telemetry",
    ]
    if intent == "weather":
        pipeline_steps.append("Retrieving Live Weather Telemetry")
    elif intent == "crop_scan":
        pipeline_steps.append("Fetching AI Disease Diagnostic History")
    elif intent == "marketplace":
        pipeline_steps.append("Querying Verified Equipment Database")
    else:
        pipeline_steps.append("Accessing ICAR Grounded Knowledge")
    
    pipeline_steps.extend(["Preparing Recommendation", "Speaking Response"])

    # 4. Action Mapping
    actions = []
    if intent in ["weather", "rain", "temperature"]:
        actions.append({"label": "☁️ Open Weather Forecast", "route": "/weather"})
    elif intent in ["crop_scan", "leaf", "disease"]:
        actions.append({"label": "📷 Open Crop Scanner", "route": "/scan"})
    elif intent in ["marketplace", "tractor", "rent"]:
        actions.append({"label": "🚜 Browse Marketplace", "route": "/equipment"})
    elif intent in ["market_prices"]:
        actions.append({"label": "📈 View Mandi Prices", "route": "/market"})
    else:
        actions.append({"label": "🌿 View Farmer Dashboard", "route": "/dashboard"})

    # 5. Gemini Prompt Synthesis
    gemini_key = settings.GEMINI_API_KEY
    ai_summary = None
    ai_recommendation = None
    ai_voice = None

    if gemini_key:
        prompt = f"""
        You are 'AgriSphere Companion', an expert AI farming assistant for Indian farmers.
        User Question: "{message}"
        Farmer Profile: Name={tools_context['profile']['name']}, Crop={crop_type}, City={city}.
        Live Telemetry Context: {json.dumps(tools_context)}

        Respond in clean JSON format matching EXACTLY this structure:
        {{
            "title": "Short Headline (max 6 words)",
            "summary": "Concise summary of situational context.",
            "recommendation": "Actionable, grounded agricultural advice (2-3 sentences max).",
            "voice": "Natural conversational voice output text suitable for text-to-speech."
        }}
        Do NOT wrap in markdown backticks or code blocks. Return ONLY the raw JSON object.
        """
        for model in ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={gemini_key}"
                resp = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=5.0)
                if resp.status_code == 200:
                    candidates = resp.json().get("candidates", [])
                    if candidates:
                        raw_txt = candidates[0].get("content", {}).get("parts", [])[0].get("text", "").strip()
                        raw_txt = raw_txt.replace("```json", "").replace("```", "").strip()
                        parsed = json.loads(raw_txt)
                        ai_summary = parsed.get("summary")
                        ai_recommendation = parsed.get("recommendation")
                        ai_voice = parsed.get("voice")
                        logger.info(f"Gemini Companion Synthesis Successful (model={model})")
                        break
            except Exception as ex:
                logger.warning(f"Gemini API call to {model} failed: {ex}")

    # Fallback if Gemini API key missing or timed out
    if not ai_summary:
        if intent == "weather":
            w = tools_context.get("weather", {})
            ai_summary = f"Current weather in {city}: {w.get('current_temp', 32)}°C, {w.get('description', 'Partly Cloudy')}. Rain probability: {w.get('rain_prob', 10)}%."
            ai_recommendation = "Maintain regular crop monitoring and adjust irrigation based on evening humidity."
            ai_voice = f"Hello {tools_context['profile']['name']}. Weather in {city} is {w.get('current_temp', 32)} degrees. {ai_recommendation}"
        elif intent == "crop_scan":
            ai_summary = f"Crop Scanner is ready to inspect your {crop_type} foliage using OpenCV and YOLOv8."
            ai_recommendation = "Upload a clear photo of the affected leaf in bright natural light to diagnose visual symptoms."
            ai_voice = f"Ready to scan your {crop_type} leaf. Please upload or take a photo."
        elif intent == "marketplace":
            ai_summary = "Equipment Marketplace has active tractor and machinery rentals available in your district."
            ai_recommendation = "Browse verified listings or post your own equipment for rental income."
            ai_voice = f"Here are the available machinery listings in your region."
        else:
            ai_summary = f"AgriSphere Companion is active for {crop_type} farming in {city}."
            ai_recommendation = "You can ask about weather forecasts, disease diagnostics, market prices, or equipment rentals."
            ai_voice = f"Hello {tools_context['profile']['name']}. How can I assist your {crop_type} farm today?"

    return {
        "intent": intent,
        "title": f"🌾 AgriSphere Companion — {intent.replace('_', ' ').title()}",
        "summary": ai_summary,
        "recommendation": ai_recommendation,
        "actions": actions,
        "voice": ai_voice,
        "confidence": "High",
        "pipeline_steps": pipeline_steps,
        "context_applied": {
            "farmer_name": tools_context['profile']['name'],
            "crop_type": crop_type,
            "city": city,
            "language": language,
        },
    }
