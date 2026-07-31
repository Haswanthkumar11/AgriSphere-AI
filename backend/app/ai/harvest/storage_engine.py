"""
AgriSphere AI — Post-Harvest Intelligence Subsystem 5: Storage Engine
Smart Storage Risk Indicator (🟢 Safe / 🟡 Monitor / 🔴 High Risk), shelf life, and climate limits.
"""

def generate_storage_advice(grade_info: dict, quality_analysis: dict, crop_type: str) -> dict:
    """
    Evaluates storage safety & risk level.
    Safe 🟢: Low risk, 180 days shelf life.
    Monitor 🟡: Moderate risk, inspect every 2 weeks, humidity <60%.
    High Risk 🔴: Dry before storage, fungal risk.
    """
    moisture_status = quality_analysis["moisture_status"]
    score = grade_info["quality_score"]

    if moisture_status == "Low" and score >= 85:
        risk_level = "SAFE"
        risk_label = "🟢 Safe"
        shelf_life_days = 180
        guidance = "Storage risk is low. Grains are dry and suitable for long-term storage in hermetic bags."
        humidity_limit = 60
        temp_limit = 25
    elif moisture_status == "Moderate" or score >= 70:
        risk_level = "MONITOR"
        risk_label = "🟡 Monitor"
        shelf_life_days = 90
        guidance = "Inspect every 2 weeks. Maintain storage humidity below 60% and ensure aeration."
        humidity_limit = 55
        temp_limit = 22
    else:
        risk_level = "HIGH_RISK"
        risk_label = "🔴 High Risk"
        shelf_life_days = 14
        guidance = "High risk of fungal growth. Sun-dry grains to 12% moisture before sealing in storage."
        humidity_limit = 50
        temp_limit = 20

    storage_type = "Hermetic Grain Bags (PICS)" if risk_level == "SAFE" else "Well-ventilated Metal Silo" if risk_level == "MONITOR" else "Sun-Drying Yard before Jute Bags"

    return {
        "storage_type": storage_type,
        "shelf_life_days": shelf_life_days,
        "risk_level": risk_level,
        "risk_label": risk_label,
        "actionable_guidance": guidance,
        "humidity_limit_pct": humidity_limit,
        "temp_limit_c": temp_limit,
        "pest_precautions": [
            "Use Neem oil / Aluminum Phosphide tablet in sealed storage",
            "Keep bags 30cm off concrete floor on wooden pallets",
            "Monitor grain temperature weekly",
        ],
    }
