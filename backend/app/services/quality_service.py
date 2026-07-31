"""Grain quality business logic (Module 3). Only talks to ai/grain_engine."""
import logging
from sqlalchemy.orm import Session

from ..ai import grain_engine
from ..repositories import grade_repository

logger = logging.getLogger("agrisphere.quality")


async def grade_grain(db: Session, file_bytes: bytes, farmer_id: str) -> dict:
    result = grain_engine.analyze(file_bytes)
    record = grade_repository.create(db, farmer_id=farmer_id, result=result)
    logger.info(f"Grade {record.id} for {farmer_id}: score={result['quality_score']}")

    return {
        "crop": result["crop"],
        "quality_score": result["quality_score"],
        "metrics": {
            "avg_grain_length_mm": result["avg_grain_length_mm"],
            "moisture_damage_percent": result["moisture_damage_percent"],
            "foreign_matter_percent": result["foreign_matter_percent"],
        },
        "grain_count": result.get("grain_count", 0),
        "recommended_floor_price_per_quintal": result["recommended_price"],
        "note": result.get("note"),
    }
