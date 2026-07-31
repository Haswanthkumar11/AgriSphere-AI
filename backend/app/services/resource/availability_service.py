"""
AgriSphere AI — Availability Service (Module 5 Service 3)
Double-booking overlap checking & availability calendar slots.
"""
from datetime import date
from sqlalchemy.orm import Session
from ...repositories import booking_repository


def check_date_availability(db: Session, equipment_id: str, from_date: date, to_date: date) -> dict:
    """Checks if requested date range has a double booking overlap."""
    has_overlap = booking_repository.check_booking_overlap(db, equipment_id, from_date, to_date)
    return {
        "equipment_id": equipment_id,
        "from_date": from_date.isoformat(),
        "to_date": to_date.isoformat(),
        "is_available": not has_overlap,
        "message": "Equipment is available for selected dates" if not has_overlap else "Equipment is already booked for these dates.",
    }
