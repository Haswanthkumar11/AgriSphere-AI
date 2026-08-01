"""
AgriSphere AI — Farmer & User Repository Access
Handles database queries & writes for users, user_profiles, and farmers tables.
"""
from sqlalchemy.orm import Session
from ..models.user import User
from ..models.user_profile import UserProfile
from ..models.farmer import Farmer


def get_user_by_phone(db: Session, phone: str) -> User | None:
    return db.query(User).filter(User.phone == phone.strip()).first()


def get_user_by_id(db: Session, user_id: str) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def get_profile_by_user_id(db: Session, user_id: str) -> UserProfile | None:
    return db.query(UserProfile).filter(UserProfile.user_id == user_id).first()


def get_farmer_by_user_id(db: Session, user_id: str) -> Farmer | None:
    return db.query(Farmer).filter(Farmer.user_id == user_id).first()


def list_all_farmers(db: Session) -> list[dict]:
    """Returns list of all farmers joining user, user_profile, and farmer table."""
    results = (
        db.query(User, UserProfile, Farmer)
        .join(UserProfile, UserProfile.user_id == User.id)
        .outerjoin(Farmer, Farmer.user_id == User.id)
        .order_by(User.created_at.desc())
        .all()
    )
    formatted = []
    for u, prof, f in results:
        formatted.append({
            "id": u.id,
            "name": prof.full_name,
            "phone": u.phone,
            "role": prof.role,
            "status": prof.status,
            "crop_type": f.crop_type if f else "Tomato",
            "land_size": f.land_size if f else 1.0,
            "created_at": u.created_at.isoformat() if u.created_at else None,
        })
    return formatted
