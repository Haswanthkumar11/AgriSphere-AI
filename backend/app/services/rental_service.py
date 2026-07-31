"""Equipment sharing/booking business logic (Module 4)."""
import logging
from sqlalchemy.orm import Session

from ..core.exceptions import NotFoundException, ConflictException
from ..repositories import equipment_repository, booking_repository

logger = logging.getLogger("agrisphere.rentals")


def list_equipment(db: Session) -> list[dict]:
    items = equipment_repository.list_all(db)
    return [
        {
            "id": e.id, "name": e.name, "category": e.category, "owner_name": e.owner_name,
            "distance_km": e.distance_km, "price_per_day": e.price_per_day,
            "icon": e.icon, "available": e.available,
        }
        for e in items
    ]


def book_equipment(db: Session, equipment_id: str, farmer_id: str) -> dict:
    equipment = equipment_repository.get_by_id(db, equipment_id)
    if not equipment:
        raise NotFoundException("Equipment not found")
    if not equipment.available:
        raise ConflictException("Equipment already booked")

    booking = booking_repository.create(db, equipment_id=equipment.id, farmer_id=farmer_id)
    equipment_repository.mark_unavailable(db, equipment)
    logger.info(f"Booking {booking.id}: {equipment.id} by {farmer_id}")

    return {
        "booking_id": booking.id,
        "status": booking.status,
        "equipment_name": equipment.name,
        "owner_name": equipment.owner_name,
        "price_per_day": equipment.price_per_day,
        "message": f"Booked! {equipment.owner_name} will confirm shortly.",
    }


def list_bookings(db: Session, farmer_id: str) -> list[dict]:
    bookings = booking_repository.list_for_farmer(db, farmer_id)
    out = []
    for b in bookings:
        eq = equipment_repository.get_by_id(db, b.equipment_id)
        out.append({
            "booking_id": b.id,
            "equipment_name": eq.name if eq else "Unknown",
            "status": b.status,
            "created_at": b.created_at.isoformat(),
        })
    return out
