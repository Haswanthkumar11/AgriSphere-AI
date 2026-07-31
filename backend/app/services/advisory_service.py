"""Voice/WhatsApp advisory business logic (Module 2 support)."""
import logging
from sqlalchemy.orm import Session

from ..ai import speech_engine
from ..repositories import voice_alert_repository

logger = logging.getLogger("agrisphere.advisory")


def dispatch_voice_alert(db: Session, farmer_phone: str, language_code: str,
                          alert_type: str, disease_name: str | None) -> dict:
    message_text, lang = speech_engine.build_message(alert_type, language_code, disease_name)
    dispatch_result = speech_engine.dispatch(message_text)

    record = voice_alert_repository.create(
        db, farmer_phone=farmer_phone, language_code=lang, alert_type=alert_type,
        message_text=message_text, status=dispatch_result["status"],
    )
    logger.info(f"Voice alert {record.id} queued for {farmer_phone} ({alert_type}, {lang})")

    return {
        "status": dispatch_result["status"],
        "message_id": record.id,
        "message_text": message_text,
        "language_code": lang,
        "audio_url": dispatch_result["audio_url"],
        "simulated": dispatch_result["simulated"],
        "note": dispatch_result["note"],
    }


def get_history(db: Session) -> list[dict]:
    records = voice_alert_repository.list_recent(db)
    return [
        {
            "id": r.id,
            "alert_type": r.alert_type,
            "message_text": r.message_text,
            "status": r.status,
            "created_at": r.created_at.isoformat(),
        }
        for r in records
    ]
