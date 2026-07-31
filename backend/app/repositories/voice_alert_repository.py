"""Voice alert table access."""
from sqlalchemy.orm import Session

from ..models.voice_alert import VoiceAlert


def create(db: Session, farmer_phone: str, language_code: str, alert_type: str,
           message_text: str, status: str) -> VoiceAlert:
    record = VoiceAlert(
        farmer_phone=farmer_phone, language_code=language_code, alert_type=alert_type,
        message_text=message_text, status=status,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def list_recent(db: Session, limit: int = 20) -> list[VoiceAlert]:
    return db.query(VoiceAlert).order_by(VoiceAlert.created_at.desc()).limit(limit).all()
