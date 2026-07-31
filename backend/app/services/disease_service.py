"""
Disease detection business logic (Module 2).
Never imports OpenCV/YOLO directly — always goes through ai/disease_engine.
"""
import logging
from sqlalchemy.orm import Session

from ..ai import disease_engine
from ..repositories import scan_repository

logger = logging.getLogger("agrisphere.disease")


async def scan_leaf(db: Session, file_bytes: bytes, farmer_id: str) -> dict:
    result = disease_engine.analyze(file_bytes)

    record = scan_repository.create(
        db, farmer_id=farmer_id, disease_label=result["disease_label"],
        confidence=result["confidence"], healthy=result["healthy"], remedy=result["remedy"],
    )
    logger.info(f"Scan {record.id} for {farmer_id}: {result['disease_label']} ({result['confidence']}%)")

    return {
        "scan_id": record.id,
        "disease_label": result["disease_label"],
        "healthy": result["healthy"],
        "confidence": result["confidence"],
        "remedy": result["remedy"],
        "model": result["model"],
    }


def get_history(db: Session, farmer_id: str) -> list[dict]:
    records = scan_repository.list_recent(db, farmer_id)
    return [
        {
            "scan_id": r.id,
            "disease_label": r.disease_label,
            "confidence": r.confidence,
            "healthy": r.healthy,
            "created_at": r.created_at.isoformat(),
        }
        for r in records
    ]
