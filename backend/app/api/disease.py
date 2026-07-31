from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from ..database.session import get_db
from ..core.config import settings
from ..core.responses import success_response
from ..services import disease_service

router = APIRouter(prefix="/api/v1/disease", tags=["disease"])


@router.post("/scan")
async def scan_leaf(file: UploadFile = File(...), farmer_id: str = settings.DEMO_FARMER_ID,
                     db: Session = Depends(get_db)):
    """
    Module 2 hero feature. In the shipped mobile client this same contract is
    served fully offline by an onnxruntime-web model; this endpoint is the
    online/server fallback + record-keeping path.
    """
    file_bytes = await file.read()
    result = await disease_service.scan_leaf(db, file_bytes, farmer_id)
    return success_response(data=result, message="Leaf scanned")


@router.get("/history")
def scan_history(farmer_id: str = settings.DEMO_FARMER_ID, db: Session = Depends(get_db)):
    result = disease_service.get_history(db, farmer_id)
    return success_response(data=result)
