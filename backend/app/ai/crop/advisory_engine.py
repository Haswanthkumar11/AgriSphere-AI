"""
AgriSphere AI — Crop Intelligence Subsystem 6: Advisory Engine
Executes Gemini / LLM prompt synthesis grounded in ICAR knowledge base.
"""
import logging
import requests
from ...core.config import settings
from .disease_kb import get_disease_knowledge

logger = logging.getLogger("agrisphere.ai.advisory_engine")


def generate_advisory(disease_name: str, disease_code: str, crop_type: str, severity: str, confidence: float) -> dict:
    """
    Synthesizes regional farming advisory.
    Uses Gemini API if key is present; gracefully falls back to grounded KB synthesis.
    """
    kb = get_disease_knowledge(disease_code) or {}
    gemini_key = settings.GEMINI_API_KEY
    is_gemini = False
    explanation = None
    govt_advisory = kb.get("government_advisory", "Follow ICAR regional extension recommendations.")

    if gemini_key:
        logger.info(f"Gemini Started: Requesting advisory for {disease_name} on {crop_type} (severity={severity})")
        prompt = (
            f"You are an expert ICAR agricultural scientist. Provide a concise, 2-sentence regional farming advisory "
            f"for a farmer in Tirupati whose {crop_type} crop has {disease_name} (severity: {severity}, confidence: {confidence*100:.1f}%). "
            f"Include practical immediate steps."
        )
        
        # Try Gemini API endpoints
        for model in ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-flash-latest"]:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={gemini_key}"
                resp = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=6.0)
                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts and "text" in parts[0]:
                            explanation = parts[0]["text"].strip()
                            is_gemini = True
                            logger.info(f"Gemini Response Success (model={model}): {explanation[:60]}...")
                            break
                else:
                    logger.warning(f"Gemini API model {model} returned status {resp.status_code}: {resp.text[:120]}")
            except Exception as ex:
                logger.warning(f"Gemini API call to {model} failed: {ex}")

    if not explanation:
        logger.info("Falling back to ICAR Grounded Knowledge Base synthesis")
        explanation = kb.get("description", f"Detected {disease_name} on {crop_type} leaf with {severity} severity.")

    return {
        "explanation": explanation,
        "government_advisory": govt_advisory,
        "is_gemini_generated": is_gemini,
        "is_kb_grounded": True,
    }
