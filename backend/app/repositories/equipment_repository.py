"""
AgriSphere AI — Equipment Repository (Module 5)
Data access layer for Equipment.
"""
from sqlalchemy.orm import Session
from ..models.equipment import Equipment


def create_equipment(db: Session, equipment_data: dict) -> Equipment:
    equip = Equipment(
        owner_id=equipment_data.get("owner_id", "usr_demo"),
        name=equipment_data["name"],
        category=equipment_data.get("category", "tractor").lower(),
        brand=equipment_data.get("brand"),
        model=equipment_data.get("model"),
        description=equipment_data.get("description"),
        price_per_day=equipment_data["price_per_day"],
        price_per_hour=equipment_data.get("price_per_hour"),
        image_url=equipment_data.get("image_url", "/static/images/tractor.png"),
        village=equipment_data.get("village", "Amaravati"),
        district=equipment_data.get("district", "Guntur"),
        state=equipment_data.get("state", "Andhra Pradesh"),
        latitude=equipment_data.get("latitude"),
        longitude=equipment_data.get("longitude"),
        is_available=equipment_data.get("is_available", True),
        is_verified=equipment_data.get("is_verified", True),
        operator_available=equipment_data.get("operator_available", False),
    )
    db.add(equip)
    db.commit()
    db.refresh(equip)
    return equip


def get_equipment_by_id(db: Session, equipment_id: str) -> Equipment | None:
    return db.query(Equipment).filter(Equipment.id == equipment_id).first()


def list_equipment(
    db: Session,
    category: str | None = None,
    district: str | None = None,
    village: str | None = None,
    operator_available: bool | None = None,
    available_only: bool = True,
    sort_by: str | None = None,
    limit: int = 50,
) -> list[Equipment]:
    query = db.query(Equipment)
    if available_only:
        query = query.filter(Equipment.is_available == True)
    if category:
        query = query.filter(Equipment.category.ilike(f"%{category}%"))
    if district:
        query = query.filter(Equipment.district.ilike(f"%{district}%"))
    if village:
        query = query.filter(Equipment.village.ilike(f"%{village}%"))
    if operator_available is not None:
        query = query.filter(Equipment.operator_available == operator_available)

    if sort_by == "lowest_price":
        query = query.order_by(Equipment.price_per_day.asc())
    elif sort_by == "highest_price":
        query = query.order_by(Equipment.price_per_day.desc())
    else:
        query = query.order_by(Equipment.created_at.desc())

    return query.limit(limit).all()


def update_equipment(db: Session, equipment_id: str, updates: dict) -> Equipment | None:
    equip = get_equipment_by_id(db, equipment_id)
    if not equip:
        return None
    for key, val in updates.items():
        if hasattr(equip, key) and val is not None:
            setattr(equip, key, val)
    db.commit()
    db.refresh(equip)
    return equip


def toggle_equipment_availability(db: Session, equipment_id: str) -> Equipment | None:
    equip = get_equipment_by_id(db, equipment_id)
    if not equip:
        return None
    equip.is_available = not equip.is_available
    db.commit()
    db.refresh(equip)
    return equip


def delete_equipment(db: Session, equipment_id: str) -> bool:
    equip = get_equipment_by_id(db, equipment_id)
    if not equip:
        return False
    db.delete(equip)
    db.commit()
    return True
