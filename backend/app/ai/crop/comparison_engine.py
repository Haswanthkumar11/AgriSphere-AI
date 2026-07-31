"""
AgriSphere AI — Crop Intelligence Subsystem 9: Comparison Engine
Side-by-side scan comparison over time with quantitative metrics.
"""
from datetime import datetime


def compare_scans(session_a: dict, session_b: dict) -> dict:
    """
    Compares two sessions chronologically.
    Returns percentage change, time delta in days, severity trend score, and recommendations.
    """
    date_a_str = session_a.get("created_at") or session_a.get("started_at", "")
    date_b_str = session_b.get("created_at") or session_b.get("started_at", "")

    try:
        dt_a = datetime.fromisoformat(date_a_str.replace("Z", ""))
        dt_b = datetime.fromisoformat(date_b_str.replace("Z", ""))
        days_between = max(1, abs((dt_b - dt_a).days))
    except Exception:
        days_between = 7

    pred_a = session_a.get("prediction", {})
    pred_b = session_b.get("prediction", {})

    area_a = pred_a.get("affected_area_pct", 0.0)
    area_b = pred_b.get("affected_area_pct", 0.0)

    area_delta = round(area_b - area_a, 1)

    # Percentage change calculation
    if area_a > 0:
        pct_change = round(((area_b - area_a) / area_a) * 100, 1)
    else:
        pct_change = 0.0 if area_b == 0 else 100.0

    if area_delta < -2.0 or (pred_a.get("healthy") is False and pred_b.get("healthy") is True):
        trend = "improved"
        trend_label = "Disease Recovering 🎉"
        trend_score = 85.0
        recommendation = f"Lesion area reduced by {abs(area_delta)}% over {days_between} days. Treatment protocol is effective. Continue monitoring for another 5 days."
    elif area_delta > 3.0:
        trend = "worsened"
        trend_label = "Disease Progressed ⚠️"
        trend_score = 35.0
        recommendation = f"Lesion area increased by {area_delta}% over {days_between} days. Re-apply recommended fungicide or consult local KVK extension officer."
    else:
        trend = "stable"
        trend_label = "Condition Stable 🟢"
        trend_score = 65.0
        recommendation = f"Disease spread has stabilized over {days_between} days ({area_b}% affected area). Maintain regular spray schedule."

    return {
        "session_a": {
            "id": session_a.get("id"),
            "date": date_a_str,
            "disease_name": pred_a.get("disease_name", "Unknown"),
            "severity": pred_a.get("severity", "mild"),
            "affected_area_pct": area_a,
        },
        "session_b": {
            "id": session_b.get("id"),
            "date": date_b_str,
            "disease_name": pred_b.get("disease_name", "Unknown"),
            "severity": pred_b.get("severity", "mild"),
            "affected_area_pct": area_b,
        },
        "comparison_metrics": {
            "area_delta_pct": area_delta,
            "percentage_change": pct_change,
            "days_between_scans": days_between,
            "trend": trend,
            "trend_label": trend_label,
            "trend_score": trend_score,
            "recommendation": recommendation,
        },
    }
