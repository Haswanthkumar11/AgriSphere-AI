from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from ..database.session import get_db
from ..core.config import settings
from ..core.responses import success_response
from ..services import quality_service

router = APIRouter(prefix="/api/v1/quality", tags=["quality"])


@router.post("/grade")
async def grade_grain(file: UploadFile = File(...), farmer_id: str = settings.DEMO_FARMER_ID,
                       db: Session = Depends(get_db)):
    """Module 3: real OpenCV contour-detection pipeline (see ai/grain_engine.py)."""
    file_bytes = await file.read()
    result = await quality_service.grade_grain(db, file_bytes, farmer_id)
    return success_response(data=result, message="Grain graded")
