"""Farmer table access — no business logic, only queries/writes."""
from sqlalchemy.orm import Session

from ..models.farmer import Farmer


def get_by_phone(db: Session, phone: str) -> Farmer | None:
    return db.query(Farmer).filter(Farmer.phone == phone).first()


def get_by_id(db: Session, farmer_id: str) -> Farmer | None:
    return db.query(Farmer).filter(Farmer.id == farmer_id).first()


def create(db: Session, name: str, phone: str) -> Farmer:
    farmer = Farmer(name=name, phone=phone)
    db.add(farmer)
    db.commit()
    db.refresh(farmer)
    return farmer
