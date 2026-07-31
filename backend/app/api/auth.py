from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database.session import get_db
from ..core.responses import success_response
from ..schemas.auth import LoginRequest
from ..services import auth_service

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    result = auth_service.login(db, phone=payload.phone, name=payload.name)
    return success_response(data=result, message="Login successful")
