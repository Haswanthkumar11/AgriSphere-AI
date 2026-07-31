"""
AgriSphere AI — Disease Knowledge Base Repository
Data access layer for DiseaseKnowledge.
"""
import json
from sqlalchemy.orm import Session
from ..models.crop_scan import DiseaseKnowledge
from ..ai.crop.disease_kb import KNOWLEDGE_BASE


def seed_disease_knowledge_base(db: Session) -> None:
    """Populates Knowledge Base table if empty on startup."""
    if db.query(DiseaseKnowledge).count() == 0:
        for code, kb in KNOWLEDGE_BASE.items():
            record = DiseaseKnowledge(
                disease_code=code,
                disease_name=kb["disease_name"],
                crop_type=kb["crop_type"],
                scientific_name=kb.get("scientific_name"),
                description=kb.get("description"),
                symptoms_json=json.dumps(kb.get("symptoms", [])),
                causes_json=json.dumps(kb.get("causes", [])),
                prevention_json=json.dumps(kb.get("prevention", [])),
                chemical_treatment=kb.get("chemical_treatment"),
                organic_treatment=kb.get("organic_treatment"),
                government_advisory=kb.get("government_advisory"),
                image_icon="🍃",
            )
            db.add(record)
        db.commit()


def get_disease_by_code(db: Session, disease_code: str) -> DiseaseKnowledge | None:
    return db.query(DiseaseKnowledge).filter(DiseaseKnowledge.disease_code == disease_code).first()


def list_all_disease_knowledge(db: Session) -> list[DiseaseKnowledge]:
    return db.query(DiseaseKnowledge).all()
