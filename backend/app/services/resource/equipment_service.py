"""
AgriSphere AI — Equipment Service (Module 5 Service 1)
Equipment CRUD, availability toggle, owner detail formatting.
"""
import urllib.parse
from sqlalchemy.orm import Session
from ...repositories import equipment_repository
from ...models.farmer import Farmer


def _format_equipment_dict(equip: any, db: Session) -> dict:
    """Formats equipment entity into rich response payload with owner join & prefilled WhatsApp/Call links."""
    owner_name = "Suresh Reddy"
    owner_phone = "+919876543210"

    if equip.owner_id:
        owner_farmer = db.query(Farmer).filter(Farmer.id == equip.owner_id).first()
        if owner_farmer:
            owner_name = owner_farmer.name
            owner_phone = owner_farmer.phone

    clean_phone = owner_phone.replace("+", "").replace(" ", "").replace("-", "")

    # Prefilled WhatsApp Message
    wa_msg = (
        f"Hello {owner_name},\n"
        f"I found your equipment '{equip.name}' on AgriSphere AI.\n"
        f"Village: {equip.village or 'Amaravati'}.\n"
        f"Could you please confirm availability for rental?\n"
        f"Thank you!"
    )
    encoded_wa = urllib.parse.quote(wa_msg)

    return {
        "id": equip.id,
        "owner_id": equip.owner_id or "usr_demo",
        "owner_name": owner_name,
        "owner_phone": owner_phone,
        "name": equip.name,
        "category": equip.category,
        "brand": equip.brand or "Mahindra",
        "model": equip.model or "2025",
        "description": equip.description or f"High-performance {equip.name} available for farm rental.",
        "price_per_day": equip.price_per_day,
        "price_per_hour": equip.price_per_hour or round(equip.price_per_day / 8, 1),
        "image_url": equip.image_url or "/static/images/tractor.png",
        "village": equip.village or "Amaravati",
        "district": equip.district or "Guntur",
        "state": equip.state or "Andhra Pradesh",
        "is_available": equip.is_available,
        "is_verified": equip.is_verified,
        "operator_available": equip.operator_available,
        "call_link": f"tel:{owner_phone}",
        "whatsapp_link": f"https://wa.me/{clean_phone}?text={encoded_wa}",
        "created_at": equip.created_at.isoformat() if equip.created_at else None,
    }


def create_new_equipment(db: Session, equipment_data: dict) -> dict:
    equip = equipment_repository.create_equipment(db, equipment_data)
    return _format_equipment_dict(equip, db)


def get_equipment_detail(db: Session, equipment_id: str) -> dict | None:
    equip = equipment_repository.get_equipment_by_id(db, equipment_id)
    if not equip:
        return None
    return _format_equipment_dict(equip, db)


def toggle_availability(db: Session, equipment_id: str) -> dict | None:
    equip = equipment_repository.toggle_equipment_availability(db, equipment_id)
    if not equip:
        return None
    return _format_equipment_dict(equip, db)


def delete_equipment_listing(db: Session, equipment_id: str) -> bool:
    return equipment_repository.delete_equipment(db, equipment_id)
