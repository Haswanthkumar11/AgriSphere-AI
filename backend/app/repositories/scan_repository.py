"""Disease scan table access."""
from sqlalchemy.orm import Session

from ..models.scan import ScanRecord


def create(db: Session, farmer_id: str, disease_label: str, confidence: float,
           healthy: bool, remedy: str) -> ScanRecord:
    record = ScanRecord(
        farmer_id=farmer_id, disease_label=disease_label,
        confidence=confidence, healthy=healthy, remedy=remedy,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def list_recent(db: Session, farmer_id: str, limit: int = 20) -> list[ScanRecord]:
    return (
        db.query(ScanRecord)
        .filter(ScanRecord.farmer_id == farmer_id)
        .order_by(ScanRecord.created_at.desc())
        .limit(limit)
        .all()
    )
