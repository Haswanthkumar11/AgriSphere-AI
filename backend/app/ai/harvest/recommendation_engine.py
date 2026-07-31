"""
AgriSphere AI — Post-Harvest Intelligence Subsystem 7: Recommendation Engine
Warehouse best practices and action steps.
"""

def generate_harvest_action_steps(grade_info: dict, storage_info: dict, market_info: dict) -> list[str]:
    """Generates 3 clear, actionable next steps for the farmer."""
    steps = [
        f"1. {market_info['recommendation_label']}.",
        f"2. {storage_info['actionable_guidance']}",
        f"3. Maintain storage temperature below {storage_info['temp_limit_c']}°C and inspect in {storage_info['shelf_life_days'] // 4} days.",
    ]
    return steps
