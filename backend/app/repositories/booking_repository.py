"""
AgriSphere AI — Booking Repository (Module 5)
Data access layer for Bookings & Availability checking.
"""
import random
from datetime import date, datetime
from sqlalchemy.orm import Session
from ..models.booking import Booking


def generate_booking_code() -> str:
    year = datetime.now().strftime("%Y")
    seq = random.randint(10000, 99999)
    return f"BKG-{year}-{seq}"


def check_booking_overlap(db: Session, equipment_id: str, from_date: date, to_date: date) -> bool:
    """
    Checks if equipment is already booked (status in PENDING, ACCEPTED, IN_PROGRESS) for overlapping dates.
    Returns True if an overlap exists (double booking).
    """
    overlapping = db.query(Booking).filter(
        Booking.equipment_id == equipment_id,
        Booking.status.in_(["PENDING", "ACCEPTED", "IN_PROGRESS"]),
        Booking.from_date <= to_date,
        Booking.to_date >= from_date,
    ).first()
    return overlapping is not None


def create_booking(db: Session, booking_data: dict) -> Booking:
    bkg = Booking(
        booking_code=generate_booking_code(),
        equipment_id=booking_data["equipment_id"],
        owner_id=booking_data["owner_id"],
        requester_id=booking_data.get("requester_id", "usr_demo"),
        from_date=booking_data["from_date"],
        to_date=booking_data["to_date"],
        purpose=booking_data.get("purpose", "Harvesting"),
        land_size_acres=booking_data.get("land_size_acres", 2.0),
        operator_required=booking_data.get("operator_required", False),
        special_requirements=booking_data.get("special_requirements"),
        village=booking_data.get("village", "Amaravati"),
        status="PENDING",
    )
    db.add(bkg)
    db.commit()
    db.refresh(bkg)
    return bkg


def get_booking_by_id(db: Session, booking_id: str) -> Booking | None:
    return db.query(Booking).filter(Booking.id == booking_id).first()


def list_farmer_bookings(db: Session, requester_id: str) -> list[Booking]:
    return db.query(Booking).filter(Booking.requester_id == requester_id).order_by(Booking.created_at.desc()).all()


def list_owner_bookings(db: Session, owner_id: str) -> list[Booking]:
    return db.query(Booking).filter(Booking.owner_id == owner_id).order_by(Booking.created_at.desc()).all()


def update_booking_status(db: Session, booking_id: str, status: str) -> Booking | None:
    bkg = get_booking_by_id(db, booking_id)
    if not bkg:
        return None
    bkg.status = status.upper()
    db.commit()
    db.refresh(bkg)
    return bkg
