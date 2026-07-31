from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database.session import get_db
from ..core.responses import success_response
from ..schemas.advisory import VoiceAlertRequest
from ..services import advisory_service

router = APIRouter(prefix="/api/v1/advisory", tags=["advisory"])


@router.post("/voice-dispatch")
def dispatch_voice_alert(payload: VoiceAlertRequest, db: Session = Depends(get_db)):
    result = advisory_service.dispatch_voice_alert(
        db, farmer_phone=payload.farmer_phone, language_code=payload.language_code,
        alert_type=payload.alert_type, disease_name=payload.disease_name,
    )
    return success_response(data=result, message="Alert queued")


@router.get("/history")
def alert_history(db: Session = Depends(get_db)):
    result = advisory_service.get_history(db)
    return success_response(data=result)
