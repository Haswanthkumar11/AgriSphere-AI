"""
AgriSphere AI — Officer Repository
Data access for Extension Officers table (officers).
"""
from sqlalchemy.orm import Session
from ..models.officer import Officer
from ..core.security import hash_password


def create_officer(db: Session, data: dict, created_by_admin: str = "adm_admin") -> Officer:
    pwd_hash = hash_password(data.get("password", "Officer@2026"))
    officer = Officer(
        name=data["name"].strip(),
        employee_id=data["employee_id"].strip(),
        phone=data["phone"].strip(),
        district=data.get("district", "Tirupati").strip(),
        designation=data.get("designation", "Senior Extension Officer").strip(),
        password_hash=pwd_hash,
        created_by_admin=created_by_admin,
    )
    db.add(officer)
    db.commit()
    db.refresh(officer)
    return officer


def get_by_employee_id(db: Session, employee_id: str) -> Officer | None:
    return db.query(Officer).filter(Officer.employee_id == employee_id.strip()).first()


def get_by_phone(db: Session, phone: str) -> Officer | None:
    return db.query(Officer).filter(Officer.phone == phone.strip()).first()


def list_all_officers(db: Session) -> list[Officer]:
    return db.query(Officer).order_by(Officer.created_at.desc()).all()


def delete_officer(db: Session, officer_id: str) -> bool:
    officer = db.query(Officer).filter(Officer.id == officer_id).first()
    if not officer:
        return False
    db.delete(officer)
    db.commit()
    return True
