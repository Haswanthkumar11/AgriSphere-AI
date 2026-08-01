"""Farmer table access — queries & writes."""
from sqlalchemy.orm import Session
from ..models.farmer import Farmer


def get_by_phone(db: Session, phone: str) -> Farmer | None:
    return db.query(Farmer).filter(Farmer.phone == phone).first()


def get_by_id(db: Session, farmer_id: str) -> Farmer | None:
    return db.query(Farmer).filter(Farmer.id == farmer_id).first()


def list_all(db: Session) -> list[Farmer]:
    return db.query(Farmer).order_by(Farmer.created_at.desc()).all()


def create(
    db: Session,
    name: str,
    phone: str,
    password_hash: str | None = None,
    role: str = "farmer",
    region: str | None = None,
    crop_type: str | None = None,
    land_size_acres: float | None = None,
) -> Farmer:
    # Security Rule: Registration must ALWAYS default to role="farmer" unless overridden by seed/admin
    safe_role = "farmer" if role not in ["farmer", "owner", "officer", "admin"] else role
    farmer = Farmer(
        name=name,
        phone=phone,
        password_hash=password_hash,
        role=safe_role,
        region=region or "Tirupati, Andhra Pradesh",
        crop_type=crop_type or "Tomato",
        land_size_acres=land_size_acres if land_size_acres is not None else 1.0,
    )
    db.add(farmer)
    db.commit()
    db.refresh(farmer)
    return farmer


def update_password(db: Session, farmer_id: str, new_password_hash: str) -> Farmer | None:
    farmer = get_by_id(db, farmer_id)
    if not farmer:
        return None
    farmer.password_hash = new_password_hash
    db.commit()
    db.refresh(farmer)
    return farmer


def update_role(db: Session, farmer_id: str, new_role: str) -> Farmer | None:
    farmer = get_by_id(db, farmer_id)
    if not farmer:
        return None
    if new_role not in ["farmer", "owner", "officer", "admin"]:
        raise ValueError("Invalid role specified")
    farmer.role = new_role
    db.commit()
    db.refresh(farmer)
    return farmer
