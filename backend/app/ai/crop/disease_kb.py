"""
AgriSphere AI — Crop Intelligence Subsystem 5: Disease Knowledge Base
Static ICAR / KVK agricultural extension disease repository for AI grounding with versioning.
"""

KB_METADATA = {
    "kb_version": "ICAR-KVK-2026.1",
    "last_updated": "2026-07-31",
    "authority": "Indian Council of Agricultural Research (ICAR) & Krishi Vigyan Kendra (KVK)",
}

KNOWLEDGE_BASE = {
    "tomato_early_blight": {
        "disease_code": "tomato_early_blight",
        "disease_name": "Early Blight",
        "crop_type": "Tomato",
        "scientific_name": "Alternaria solani",
        "description": "Fungal disease causing concentric target-ring lesions on lower leaves, leading to defoliation and yield loss.",
        "symptoms": [
            "Dark brown concentric rings on older lower leaves",
            "Yellow halo surrounding leaf spots",
            "Stem lesions and fruit stem-end rot",
        ],
        "causes": [
            "Fungal spores (Alternaria solani) surviving in crop debris",
            "High humidity (>80%) and warm temperature (24-29°C)",
            "Frequent rainfall or overhead sprinkler irrigation",
        ],
        "prevention": [
            "Practice 3-year crop rotation with non-solanaceous crops",
            "Use drip irrigation to avoid leaf wetness",
            "Maintain wide plant spacing for airflow",
            "Apply mulch to prevent soil-splash inoculum",
        ],
        "chemical_treatment": "Spray Copper Oxychloride 50 WP (3g/L) or Mancozeb 75 WP (2.5g/L) at 10-14 day intervals.",
        "organic_treatment": "Spray Neem Oil 1500 ppm (5ml/L) + Trichoderma viride (10g/L) on affected foliage.",
        "spray_window": "Early morning (6:00 AM - 8:30 AM) within 48 hours",
        "recovery_days": 7,
        "government_advisory": "ICAR-IIHR Advisory: Remove and burn infected lower leaves up to 30cm from soil level before spraying.",
        "kb_version": KB_METADATA["kb_version"],
        "last_updated": KB_METADATA["last_updated"],
    },
    "paddy_rice_blast": {
        "disease_code": "paddy_rice_blast",
        "disease_name": "Rice Blast",
        "crop_type": "Paddy",
        "scientific_name": "Magnaporthe oryzae",
        "description": "Devastating fungal disease causing spindle-shaped lesions on leaves and neck rot on flower panicles.",
        "symptoms": [
            "Spindle-shaped grey-centered spots on leaves",
            "Lesions with reddish-brown margins",
            "Black rot at panicle neck (Neck Blast)",
        ],
        "causes": [
            "Airborne spores during cool nights and overcast days",
            "Excessive nitrogen fertilizer application",
            "Relative humidity above 90%",
        ],
        "prevention": [
            "Avoid excess nitrogen fertilizer; split doses into 3 applications",
            "Seed treatment with Pseudomonas fluorescens (10g/kg)",
            "Maintain 2-5cm standing water level during tillering",
        ],
        "chemical_treatment": "Spray Tricyclazole 75 WP (0.6g/L) or Isoprothiolane 40 EC (1.5ml/L).",
        "organic_treatment": "Spray Pseudomonas fluorescens (10g/L) at 15-day intervals.",
        "spray_window": "Late afternoon (4:00 PM - 6:00 PM)",
        "recovery_days": 10,
        "government_advisory": "TNAU/ANGRAU Advisory: Apply potassium top-dressing to increase leaf silica and natural resistance.",
        "kb_version": KB_METADATA["kb_version"],
        "last_updated": KB_METADATA["last_updated"],
    },
    "chilli_leaf_curl": {
        "disease_code": "chilli_leaf_curl",
        "disease_name": "Chilli Leaf Curl Virus",
        "crop_type": "Chilli",
        "scientific_name": "Begomovirus (transmitted by Bemisia tabaci)",
        "description": "Viral infection transmitted by whiteflies causing severe leaf curling, stunting, and flower drop.",
        "symptoms": [
            "Upward puckering and curling of young leaves",
            "Thickened veins and reduced leaf size",
            "Stunted plant growth and flower drop",
        ],
        "causes": [
            "Whitefly vector (Bemisia tabaci) population surge",
            "Dry warm weather favoring vector multiplication",
            "Presence of weed hosts nearby",
        ],
        "prevention": [
            "Install yellow sticky traps (15 traps/acre) for whiteflies",
            "Border crop with 3 rows of maize/sorghum to block vectors",
            "Spray imidacloprid seed treatment prior to transplanting",
        ],
        "chemical_treatment": "Spray Fipronil 5 SC (2ml/L) or Diafenthiuron 50 WP (1.25g/L) to control whitefly vector.",
        "organic_treatment": "Spray Neem seed kernel extract (NSKE 5%) + sticky yellow trap installation.",
        "spray_window": "Early morning before vector movement begins",
        "recovery_days": 14,
        "government_advisory": "KVK Tirupati Advisory: Rogue out severely infected viral plants immediately to stop vector spread.",
        "kb_version": KB_METADATA["kb_version"],
        "last_updated": KB_METADATA["last_updated"],
    },
    "healthy_crop": {
        "disease_code": "healthy_crop",
        "disease_name": "Healthy Leaf",
        "crop_type": "All",
        "scientific_name": "N/A",
        "description": "Crop leaves display optimal chlorophyll content, uniform color, and zero structural lesions.",
        "symptoms": ["Vibrant green coloration", "Intact leaf margin", "No fungal spots or vector damage"],
        "causes": ["Good nutrient balance and timely irrigation"],
        "prevention": ["Maintain weekly scouting and balanced NPK fertilisation"],
        "chemical_treatment": "No chemical treatment required.",
        "organic_treatment": "Preventive Panchagavya spray (3%) optional for immunity booster.",
        "spray_window": "N/A",
        "recovery_days": 0,
        "government_advisory": "ICAR General Guidance: Continue regular crop monitoring every 7 days.",
        "kb_version": KB_METADATA["kb_version"],
        "last_updated": KB_METADATA["last_updated"],
    },
}


def get_disease_knowledge(disease_code: str) -> dict | None:
    """Retrieve grounded knowledge record by disease code."""
    return KNOWLEDGE_BASE.get(disease_code, KNOWLEDGE_BASE.get("healthy_crop"))


def list_knowledge_base() -> list[dict]:
    """List all knowledge base entries for API exposure."""
    return list(KNOWLEDGE_BASE.values())
