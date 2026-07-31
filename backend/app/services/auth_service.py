"""Auth business logic — routers never touch the DB or JWT directly."""
import logging
from sqlalchemy.orm import Session

from ..core.security import create_access_token
from ..repositories import farmer_repository

logger = logging.getLogger("agrisphere.auth")


def login(db: Session, phone: str, name: str | None) -> dict:
    """
    Demo OTP-less login: any phone number logs in / auto-registers.
    Production swaps this for Supabase Auth OTP verification per the README.
    """
    farmer = farmer_repository.get_by_phone(db, phone)
    if not farmer:
        farmer = farmer_repository.create(db, name=name or "New Farmer", phone=phone)
        logger.info(f"New farmer registered: {farmer.id}")
    else:
        logger.info(f"Farmer logged in: {farmer.id}")

    token = create_access_token(farmer.id, farmer.phone)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": farmer.id,
            "name": farmer.name,
            "region": farmer.region,
            "crop_type": farmer.crop_type,
            "land_size_acres": farmer.land_size_acres,
        },
    }
