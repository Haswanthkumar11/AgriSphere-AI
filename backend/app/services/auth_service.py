"""Auth business logic — handles registration, password authentication, and JWT token issuance."""
import logging
from sqlalchemy.orm import Session

from ..core.security import create_access_token, hash_password, verify_password
from ..core.exceptions import UnauthorizedException, ConflictException
from ..repositories import farmer_repository

logger = logging.getLogger("agrisphere.auth")


def register_user(db: Session, data: dict) -> dict:
    """
    Registers a new farmer account.
    Rules:
    1. Rejects duplicate phone numbers with 409 Conflict.
    2. Ignores any incoming role parameter and strictly forces role="farmer".
    3. Hashes password using bcrypt.
    """
    phone = data.get("phone", "").strip()
    name = data.get("name", "").strip()
    password = data.get("password", "")

    existing = farmer_repository.get_by_phone(db, phone)
    if existing:
        logger.warning(f"Registration rejected: phone '{phone}' already registered.")
        raise ConflictException("Phone number already registered")

    pwd_hash = hash_password(password)
    farmer = farmer_repository.create(
        db,
        name=name,
        phone=phone,
        password_hash=pwd_hash,
        role="farmer",  # Strict security rule: new registrations are always farmers
        region=data.get("region"),
        crop_type=data.get("crop_type"),
        land_size_acres=data.get("land_size_acres"),
    )
    logger.info(f"New farmer registered: {farmer.id} (phone: {farmer.phone})")

    return {
        "id": farmer.id,
        "name": farmer.name,
        "phone": farmer.phone,
        "role": farmer.role,
        "region": farmer.region,
        "crop_type": farmer.crop_type,
        "land_size_acres": farmer.land_size_acres,
    }


def login_user(db: Session, phone: str, password: str) -> dict:
    """
    Authenticates an existing user.
    Rules:
    1. Login ONLY authenticates. It NEVER registers, creates, or updates users.
    2. Verifies bcrypt password hash.
    3. If user does not exist or password is wrong, returns 401 Unauthorized with generic message:
       "Invalid phone or password" (never exposing whether phone exists or password is wrong).
    """
    phone = phone.strip()
    farmer = farmer_repository.get_by_phone(db, phone)

    # Security Rule: Never reveal whether phone exists or password is wrong
    if not farmer or not verify_password(password, farmer.password_hash):
        logger.warning(f"Login failed for phone '{phone}': invalid credentials.")
        raise UnauthorizedException("Invalid phone or password")

    logger.info(f"User logged in ({farmer.role}): {farmer.id}")

    token = create_access_token(farmer.id, farmer.phone, role=farmer.role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": farmer.id,
            "name": farmer.name,
            "phone": farmer.phone,
            "role": farmer.role,
            "region": farmer.region,
            "crop_type": farmer.crop_type,
            "land_size_acres": farmer.land_size_acres,
        },
    }
