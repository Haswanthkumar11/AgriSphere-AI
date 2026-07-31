"""
AgriSphere AI — Crop Intelligence Subsystem 7: Recommendation Engine
Generates treatment protocols, organic alternatives, and action steps.
"""
from .disease_kb import get_disease_knowledge


def generate_recommendations(disease_code: str, severity: str) -> dict:
    """
    Generates structured chemical, organic, preventive measures, and clear action steps.
    """
    kb = get_disease_knowledge(disease_code) or get_disease_knowledge("healthy_crop")

    if kb["disease_code"] == "healthy_crop":
        return {
            "chemical_treatment": "None required.",
            "organic_treatment": "Preventive neem spray (3ml/L) optional.",
            "preventive_measures": kb["prevention"],
            "spray_window": "N/A",
            "recovery_days": 0,
            "action_steps": [
                "1. Keep monitoring leaf health weekly.",
                "2. Maintain balanced irrigation.",
                "3. Scan again in 7 days.",
            ],
        }

    action_steps = [
        f"1. {kb['chemical_treatment'].split('.')[0]}",
        f"2. {kb['prevention'][0]}",
        f"3. Rescan in {kb['recovery_days']} days to track recovery progression.",
    ]

    return {
        "chemical_treatment": kb["chemical_treatment"],
        "organic_treatment": kb["organic_treatment"],
        "preventive_measures": kb["prevention"],
        "spray_window": kb["spray_window"],
        "recovery_days": kb["recovery_days"],
        "action_steps": action_steps,
      }
