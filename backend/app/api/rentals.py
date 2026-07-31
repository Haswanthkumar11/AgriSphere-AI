from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database.session import get_db
from ..core.config import settings
from ..core.responses import success_response
from ..schemas.rentals import BookRequest
from ..services import rental_service

router = APIRouter(prefix="/api/v1/rentals", tags=["rentals"])


@router.get("/equipment")
def list_equipment(db: Session = Depends(get_db)):
    result = rental_service.list_equipment(db)
    return success_response(data=result)


@router.post("/book")
def book_equipment(payload: BookRequest, db: Session = Depends(get_db)):
    """Module 4: peer-to-peer equipment booking — real DB write, 1-click confirmation."""
    result = rental_service.book_equipment(db, equipment_id=payload.equipment_id, farmer_id=payload.farmer_id)
    return success_response(data=result, message="Equipment booked")


@router.get("/bookings")
def list_bookings(farmer_id: str = settings.DEMO_FARMER_ID, db: Session = Depends(get_db)):
    result = rental_service.list_bookings(db, farmer_id)
    return success_response(data=result)
