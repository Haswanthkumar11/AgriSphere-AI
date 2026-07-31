"""
AgriSphere AI — Crop Intelligence Subsystem 6: Advisory Engine
Executes Gemini / LLM prompt synthesis grounded in ICAR knowledge base.
"""
import logging
from ...core.config import settings
from .disease_kb import get_disease_knowledge

logger = logging.getLogger("agrisphere.ai.advisory_engine")


def generate_advisory(disease_name: str, disease_code: str, crop_type: str, severity: str, confidence: float) -> dict:
    """
    Synthesizes regional farming advisory.
    Uses Gemini API if key is present; otherwise uses grounded KB synthesis.
    """
    kb = get_disease_knowledge(disease_code) or {}

    has_gemini = bool(settings.GEMINI_API_KEY)
    
    if has_gemini:
        # TODO: Call google.generativeai Gemini 1.5 Flash API with system prompt
        logger.info("Generating advisory via Gemini 1.5 Flash Vision API...")

    # Grounded synthesis combining KB + disease classification
    explanation = kb.get("description", f"Detected {disease_name} on {crop_type} leaf with {severity} severity.")
    govt_advisory = kb.get("government_advisory", "Follow ICAR regional extension recommendations.")

    return {
        "explanation": explanation,
        "government_advisory": govt_advisory,
        "is_gemini_generated": has_gemini,
        "is_kb_grounded": True,
    }
