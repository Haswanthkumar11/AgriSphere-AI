"""Grain quality grade table access."""
from sqlalchemy.orm import Session

from ..models.grade import GradeRecord


def create(db: Session, farmer_id: str, result: dict) -> GradeRecord:
    record = GradeRecord(
        farmer_id=farmer_id,
        crop=result["crop"],
        quality_score=result["quality_score"],
        avg_grain_length_mm=result["avg_grain_length_mm"],
        moisture_damage_percent=result["moisture_damage_percent"],
        foreign_matter_percent=result["foreign_matter_percent"],
        grain_count=result.get("grain_count", 0),
        recommended_price=result["recommended_price"],
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record
