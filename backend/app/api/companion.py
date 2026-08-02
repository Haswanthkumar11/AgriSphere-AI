"""
AgriSphere AI — Companion API Endpoints
=======================================
POST /api/v1/companion/chat — Agentic AI Orchestrator Endpoint
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from ..database.session import get_db
from ..services import companion_service
from ..core.responses import success_response

router = APIRouter(prefix="/api/v1/companion", tags=["AgriSphere Companion"])


class CompanionChatRequest(BaseModel):
    message: str
    crop_type: Optional[str] = "Paddy"
    city: Optional[str] = "Tirupati"
    user_id: Optional[str] = "usr_demo"
    language: Optional[str] = "en"


@router.post("/chat", summary="Interact with AgriSphere Companion Agentic AI")
def companion_chat(payload: CompanionChatRequest, db: Session = Depends(get_db)):
    """
    Orchestrates Intent Router -> Tool Registry -> Context Builder -> Gemini 2.5 Flash -> Standard JSON Response.
    """
    if not payload.message or not payload.message.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Chat message cannot be empty")

    try:
        response = companion_service.process_companion_chat(
            db=db,
            message=payload.message.strip(),
            crop_type=payload.crop_type or "Paddy",
            city=payload.city or "Tirupati",
            user_id=payload.user_id or "usr_demo",
            language=payload.language or "en",
        )
        return success_response(data=response, message="Companion response generated successfully")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Companion orchestration error: {str(e)}",
        )
