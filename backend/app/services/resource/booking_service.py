"""
AgriSphere AI — Booking Service (Module 5 Service 2)
Booking creation, double-booking overlap checking, state transitions, & event notification emission.
"""
import urllib.parse
from datetime import date
from sqlalchemy.orm import Session
from ...repositories import booking_repository, equipment_repository
from ...models.farmer import Farmer
from .notification_service import emit_notification_event


def _format_booking_dict(bkg: any, db: Session) -> dict:
    equip = equipment_repository.get_equipment_by_id(db, bkg.equipment_id)
    equip_name = equip.name if equip else "Equipment"
    equip_price = equip.price_per_day if equip else 650.0

    owner_name = "Equipment Owner"
    owner_phone = ""

    if bkg.owner_id:
        owner_farmer = db.query(Farmer).filter(Farmer.id == bkg.owner_id).first()
        if owner_farmer:
            owner_name = owner_farmer.name
            owner_phone = owner_farmer.phone

    requester_name = "Farmer"
    requester_phone = ""

    if bkg.requester_id:
        req_farmer = db.query(Farmer).filter(Farmer.id == bkg.requester_id).first()
        if req_farmer:
            requester_name = req_farmer.name
            requester_phone = req_farmer.phone

    clean_owner_phone = owner_phone.replace("+", "").replace(" ", "").replace("-", "")

    # Prefilled WhatsApp Message from Farmer to Owner
    wa_msg = (
        f"Hello {owner_name},\n"
        f"I have submitted a booking request on AgriSphere AI.\n"
        f"Booking Code: {bkg.booking_code}\n"
        f"Equipment: {equip_name}\n"
        f"Dates: {bkg.from_date.strftime('%d %b')} -> {bkg.to_date.strftime('%d %b')}\n"
        f"Purpose: {bkg.purpose}\n"
        f"Could you please confirm the request?\n"
        f"Thank you!"
    )
    encoded_wa = urllib.parse.quote(wa_msg)

    # Total days & estimated total cost
    days = max(1, (bkg.to_date - bkg.from_date).days + 1)
    total_estimated_cost = round(days * equip_price, 2)

    return {
        "id": bkg.id,
        "booking_code": bkg.booking_code,
        "equipment_id": bkg.equipment_id,
        "equipment_name": equip_name,
        "owner_id": bkg.owner_id,
        "owner_name": owner_name,
        "owner_phone": owner_phone,
        "requester_id": bkg.requester_id,
        "requester_name": requester_name,
        "requester_phone": requester_phone,
        "from_date": bkg.from_date.isoformat(),
        "to_date": bkg.to_date.isoformat(),
        "total_days": days,
        "price_per_day": equip_price,
        "total_estimated_cost": total_estimated_cost,
        "purpose": bkg.purpose,
        "land_size_acres": bkg.land_size_acres,
        "operator_required": bkg.operator_required,
        "special_requirements": bkg.special_requirements or "None",
        "village": bkg.village,
        "status": bkg.status,
        "call_owner_link": f"tel:{owner_phone}",
        "whatsapp_owner_link": f"https://wa.me/{clean_owner_phone}?text={encoded_wa}",
        "created_at": bkg.created_at.isoformat() if bkg.created_at else None,
    }


def request_booking(db: Session, booking_data: dict) -> dict:
    """Submits booking request after verifying double-booking overlap."""
    equip = equipment_repository.get_equipment_by_id(db, booking_data["equipment_id"])
    if not equip:
        raise ValueError("Equipment listing not found")

    from_d = booking_data["from_date"]
    to_d = booking_data["to_date"]

    if booking_repository.check_booking_overlap(db, equip.id, from_d, to_d):
        raise ValueError(f"Equipment '{equip.name}' is already booked for dates {from_d} to {to_d}")

    booking_data["owner_id"] = equip.owner_id or "usr_demo"
    bkg = booking_repository.create_booking(db, booking_data)

    # Emit notification to Equipment Owner
    emit_notification_event(
        db,
        user_id=equip.owner_id or "usr_demo",
        title="🔔 New Booking Request Received",
        message=f"Farmer requested '{equip.name}' for {from_d.strftime('%d %b')} -> {to_d.strftime('%d %b')}.",
        event_type="BOOKING_REQUEST",
        reference_id=bkg.id,
        link_url="/bookings",
    )

    formatted = _format_booking_dict(bkg, db)
    formatted["confirmation_card"] = {
        "title": "✅ Booking Request Sent",
        "booking_code": bkg.booking_code,
        "owner_name": formatted["owner_name"],
        "status": "PENDING",
        "message": f"The equipment owner ({formatted['owner_name']}) has been notified of your rental request.",
    }
    return formatted


def accept_booking(db: Session, booking_id: str) -> dict:
    bkg = booking_repository.update_booking_status(db, booking_id, "ACCEPTED")
    if not bkg:
        raise ValueError("Booking not found")

    # Emit notification to Requester Farmer
    emit_notification_event(
        db,
        user_id=bkg.requester_id,
        title="✅ Booking Accepted!",
        message=f"Your rental request ({bkg.booking_code}) has been accepted by the equipment owner.",
        event_type="BOOKING_ACCEPTED",
        reference_id=bkg.id,
        link_url="/bookings",
    )

    return _format_booking_dict(bkg, db)


def reject_booking(db: Session, booking_id: str) -> dict:
    bkg = booking_repository.update_booking_status(db, booking_id, "REJECTED")
    if not bkg:
        raise ValueError("Booking not found")

    # Emit notification to Requester Farmer
    emit_notification_event(
        db,
        user_id=bkg.requester_id,
        title="❌ Booking Request Declined",
        message=f"Your rental request ({bkg.booking_code}) was declined by the equipment owner.",
        event_type="BOOKING_REJECTED",
        reference_id=bkg.id,
        link_url="/bookings",
    )

    return _format_booking_dict(bkg, db)


def complete_booking(db: Session, booking_id: str) -> dict:
    bkg = booking_repository.update_booking_status(db, booking_id, "COMPLETED")
    if not bkg:
        raise ValueError("Booking not found")

    # Emit notification to Requester Farmer
    emit_notification_event(
        db,
        user_id=bkg.requester_id,
        title="🎉 Rental Completed",
        message=f"Rental ({bkg.booking_code}) has been marked as completed.",
        event_type="BOOKING_COMPLETED",
        reference_id=bkg.id,
        link_url="/bookings",
    )

    return _format_booking_dict(bkg, db)


def get_farmer_bookings(db: Session, requester_id: str = "usr_demo") -> list[dict]:
    bkgs = booking_repository.list_farmer_bookings(db, requester_id)
    return [_format_booking_dict(b, db) for b in bkgs]


def get_owner_bookings(db: Session, owner_id: str = "usr_demo") -> list[dict]:
    bkgs = booking_repository.list_owner_bookings(db, owner_id)
    return [_format_booking_dict(b, db) for b in bkgs]


def get_rental_confirmation(db: Session, booking_id: str) -> dict:
    bkg = booking_repository.get_booking_by_id(db, booking_id)
    if not bkg:
        raise ValueError("Booking not found")
    return _format_booking_dict(bkg, db)
