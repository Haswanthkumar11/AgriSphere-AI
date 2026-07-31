"""
AgriSphere AI — Post-Harvest Intelligence Subsystem 4: Grade Engine
Data-driven grade classification (Grade A / B / C) & overall quality score (0-100).
"""

def classify_grade(quality_analysis: dict, kb_params: dict | None = None) -> dict:
    """
    Data-driven grade classifier based on AGMARK parameters.
    """
    params = kb_params or {"max_broken": 5.0, "max_foreign": 2.0}
    broken = quality_analysis["broken_grain_pct"]
    foreign = quality_analysis["foreign_matter_pct"]
    moisture_status = quality_analysis["moisture_status"]

    # Calculate overall quality score (0-100)
    penalty = (broken * 1.5) + (foreign * 2.0) + (10 if moisture_status == "High" else 3 if moisture_status == "Moderate" else 0)
    score = max(50.0, round(100.0 - penalty, 1))

    if score >= 88.0 and broken <= params.get("max_broken", 5.0) and foreign <= params.get("max_foreign", 2.0):
        grade = "Grade A"
        grade_label = "Grade A — Premium Quality 🌟"
    elif score >= 75.0:
        grade = "Grade B"
        grade_label = "Grade B — Standard Commercial Quality 🌾"
    else:
        grade = "Grade C"
        grade_label = "Grade C — Sub-Standard / High Moisture ⚠️"

    return {
        "grade": grade,
        "grade_label": grade_label,
        "quality_score": score,
    }
