"""
AgriSphere AI — Crop Intelligence Subsystem 4: Confidence Engine
Statistical confidence evaluation, severity classification, and reliability scoring.
"""

def evaluate_confidence(confidence_score: float, affected_area_pct: float) -> dict:
    """
    Classifies severity (mild, moderate, severe, none) and reliability badge status.
    """
    conf_pct = round(confidence_score * 100, 1)

    if affected_area_pct == 0 or confidence_score < 0.3:
        severity = "none"
    elif affected_area_pct < 10.0:
        severity = "mild"
    elif affected_area_pct < 25.0:
        severity = "moderate"
    else:
        severity = "severe"

    reliability_tier = "HIGH" if conf_pct >= 85 else "MEDIUM" if conf_pct >= 70 else "LOW"

    return {
        "confidence_pct": conf_pct,
        "severity": severity,
        "reliability_tier": reliability_tier,
        "is_reliable": conf_pct >= 65.0,
    }
