"""
AgriSphere AI — Post-Harvest Knowledge Base Repository
Data access layer for HarvestKnowledge with data-driven AGMARK parameters.
"""
import json
from sqlalchemy.orm import Session
from ..models.harvest import HarvestKnowledge

HARVEST_KNOWLEDGE_SEED = [
    {
        "crop_type": "Paddy",
        "grade_standards": {
            "Grade A": "Moisture <12%, Broken <3%, Foreign Matter <1%",
            "Grade B": "Moisture 12-14%, Broken 3-6%, Foreign Matter 1-3%",
            "Grade C": "Moisture >14%, Broken >6%, Foreign Matter >3%",
        },
        "quality_parameters": {"max_moisture_pct": 12.0, "max_broken_pct": 3.0, "max_foreign_matter_pct": 1.0},
        "storage_best_practices": [
            "Sun dry to 12% moisture before bagging",
            "Store in PICS hermetic bags on wooden pallets",
            "Keep storage room temperature under 25°C",
        ],
        "government_mandate": "AGMARK Paddy Grading Schedule 2026: Fair Average Quality (FAQ) standard requires moisture <= 14.0%.",
    },
    {
        "crop_type": "Wheat",
        "grade_standards": {
            "Grade A": "Moisture <11%, Broken <2%, Foreign Matter <0.5%",
            "Grade B": "Moisture 11-13%, Broken 2-5%, Foreign Matter 0.5-2%",
        },
        "quality_parameters": {"max_moisture_pct": 11.0, "max_broken_pct": 2.0, "max_foreign_matter_pct": 0.5},
        "storage_best_practices": [
            "Treat storage room with Neem extract",
            "Maintain relative humidity below 55%",
        ],
        "government_mandate": "FCI Wheat Procurement Specification: Maximum moisture allowance 12.0%.",
    },
]


def seed_harvest_knowledge_base(db: Session) -> None:
    """Populates HarvestKnowledge table if empty."""
    if db.query(HarvestKnowledge).count() == 0:
        for seed in HARVEST_KNOWLEDGE_SEED:
            rec = HarvestKnowledge(
                crop_type=seed["crop_type"],
                grade_standards_json=json.dumps(seed["grade_standards"]),
                quality_parameters_json=json.dumps(seed["quality_parameters"]),
                storage_best_practices_json=json.dumps(seed["storage_best_practices"]),
                government_mandate=seed["government_mandate"],
            )
            db.add(rec)
        db.commit()


def get_harvest_knowledge(db: Session, crop_type: str) -> HarvestKnowledge | None:
    return db.query(HarvestKnowledge).filter(HarvestKnowledge.crop_type.ilike(f"%{crop_type}%")).first()


def list_all_harvest_knowledge(db: Session) -> list[HarvestKnowledge]:
    return db.query(HarvestKnowledge).all()
