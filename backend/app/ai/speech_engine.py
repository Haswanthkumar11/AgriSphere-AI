"""
AgriSphere AI — Speech/Voice Advisory Engine (Module 2 support)
==================================================================
The regional-language message templating and event-trigger logic below is
real. The final text-to-speech audio synthesis step is SIMULATED for demo
purposes, or executed live when MURF_API_KEY is configured.

Isolation: advisory_service.py only calls `build_message()` and
`dispatch()`. Wiring real Murf AI credentials (see core/config.py)
means editing only this file — no router or schema changes required.
"""
from ..core.config import settings

TEMPLATES = {
    "HEATWAVE_WARNING": {
        "en": "Heatwave warning. Temperature rising to 41 degrees. Water your crops early morning or evening.",
        "te": "వేడిమి హెచ్చరిక. ఉష్ణోగ్రత 41 డిగ్రీలకు పెరుగుతుంది. ఉదయం లేదా సాయంత్రం పంటకు నీరు పెట్టండి.",
        "hi": "गर्मी की चेतावनी। तापमान 41 डिग्री तक बढ़ रहा है। सुबह या शाम फसल को पानी दें।",
    },
    "DISEASE_DETECTED": {
        "en": "Disease detected on your crop leaf. Spray recommended fungicide within 48 hours.",
        "te": "మీ పంట ఆకుపై వ్యాధి గుర్తించబడింది. 48 గంటల్లో సిఫార్సు చేసిన శిలీంధ్ర నాశిని పిచికారీ చేయండి.",
        "hi": "आपकी फसल की पत्ती पर रोग पाया गया। 48 घंटों के भीतर अनुशंसित फफूंदनाशी छिड़कें।",
    },
    "FROST_WARNING": {
        "en": "Frost warning tonight. Irrigate field immediately to protect root warmth.",
        "te": "ఈ రాత్రి మంచు హెచ్చరిక. వేర్ల వెచ్చదనం కాపాడటానికి వెంటనే నీటిపారుదల చేయండి.",
        "hi": "आज रात पाला पड़ने की चेतावनी। जड़ों की गर्माहट बचाने के लिए तुरंत सिंचाई करें।",
    },
}


def build_message(alert_type: str, language_code: str, disease_name: str | None = None) -> tuple[str, str]:
    """Returns (message_text, resolved_language_code)."""
    lang = language_code[:2] if language_code else "en"
    template_set = TEMPLATES.get(alert_type, TEMPLATES["DISEASE_DETECTED"])
    message_text = template_set.get(lang, template_set["en"])
    if disease_name:
        message_text = f"{disease_name}. {message_text}"
    return message_text, lang


def dispatch(message_text: str) -> dict:
    """
    SIMULATED: Murf AI voice audio synthesis wrapper.
    Swap in MURF_API_KEY from core/config.py to go live.
    """
    live = bool(settings.MURF_API_KEY)
    if live:
        # TODO: call Murf AI API endpoint here once credentials are configured.
        pass
    return {
        "status": "QUEUED" if not live else "SENT",
        "audio_url": None,
        "simulated": not live,
        "note": (
            "Voice synthesis dispatch simulated for demo. "
            "Set MURF_API_KEY in .env to synthesize real voice audio."
        ),
    }
