"""
AgriSphere AI — Crop Intelligence Subsystem 10: Voice Engine
Multi-lingual voice advisory dispatch wrapper.
"""
from ..speech_engine import build_message, dispatch


def dispatch_crop_voice_advisory(farmer_phone: str, language_code: str, disease_name: str) -> dict:
    """Generates localized voice advisory text and triggers TTS dispatch."""
    message_text, resolved_lang = build_message("DISEASE_DETECTED", language_code, disease_name)
    dispatch_res = dispatch(message_text)
    return {
        "message_text": message_text,
        "language_code": resolved_lang,
        "status": dispatch_res["status"],
        "audio_url": dispatch_res["audio_url"],
        "simulated": dispatch_res["simulated"],
    }
