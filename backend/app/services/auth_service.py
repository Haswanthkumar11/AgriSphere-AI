"""
AgriSphere AI — Authentication Service (RescueLens 3-Table Identity Model)
Handles user registration, authentication, JWT issuance, and admin user provisioning.
"""
import logging
from datetime import datetime
from sqlalchemy.orm import Session

from ..core.security import create_access_token, hash_password, verify_password
from ..core.exceptions import UnauthorizedException, ConflictException
from ..models.user import User
from ..models.user_profile import UserProfile
from ..models.farmer import Farmer

logger = logging.getLogger("agrisphere.auth")


def register_user(db: Session, data: dict) -> dict:
    """Self-registration for Farmers."""
    phone = data.get("phone", "").strip()
    name = data.get("name", "").strip()
    password = data.get("password", "")

    existing = db.query(User).filter(User.phone == phone).first()
    if existing:
        logger.warning(f"Registration rejected: phone '{phone}' already registered.")
        raise ConflictException("Phone number already registered")

    pwd_hash = hash_password(password)
    
    # 1. Create base auth user in users table
    user = User(phone=phone, password_hash=pwd_hash, is_active=True)
    db.add(user)
    db.flush()

    # 2. Create RBAC profile in user_profiles table
    profile = UserProfile(
        user_id=user.id,
        full_name=name,
        role="farmer",
        status="active",
    )
    db.add(profile)
    db.flush()

    # 3. Create Farmer domain metadata in farmers table
    farmer_domain = Farmer(
        user_id=user.id,
        crop_type=data.get("crop_type"),
        land_size=float(data["land_size_acres"]) if data.get("land_size_acres") else None,
        language=data.get("language", "en"),
        state=data.get("state"),
        district=data.get("district"),
        village=data.get("village"),
    )
    db.add(farmer_domain)
    db.commit()

    logger.info(f"New farmer registered: {user.id} (phone: {user.phone})")

    return {
        "id": user.id,
        "name": profile.full_name,
        "phone": user.phone,
        "role": profile.role,
        "state": farmer_domain.state,
        "district": farmer_domain.district,
        "crop_type": farmer_domain.crop_type,
        "land_size_acres": farmer_domain.land_size,
    }


def login_user(db: Session, phone: str, password: str) -> dict:
    """Unified login for Farmers, Officers, and Admins."""
    phone = phone.strip()
    user = db.query(User).filter(User.phone == phone).first()

    if not user or not verify_password(password, user.password_hash):
        logger.warning(f"Login failed for phone '{phone}': invalid credentials.")
        raise UnauthorizedException("Invalid phone or password")

    if not user.is_active:
        raise UnauthorizedException("User account is inactive")

    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    if not profile:
        profile = UserProfile(user_id=user.id, full_name="User", role="farmer")
        db.add(profile)
        db.commit()

    farmer = db.query(Farmer).filter(Farmer.user_id == user.id).first()

    user.last_login = datetime.utcnow()
    db.commit()

    logger.info(f"User logged in ({profile.role}): {user.id}")

    token = create_access_token(user.id, user.phone, role=profile.role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": profile.full_name,
            "phone": user.phone,
            "role": profile.role,
            "state": farmer.state if farmer else None,
            "district": farmer.district if farmer else None,
            "village": farmer.village if farmer else None,
            "crop_type": farmer.crop_type if farmer else None,
            "land_size": farmer.land_size if farmer else None,
            "language": farmer.language if farmer else "en",
        },
    }


def provision_user(db: Session, data: dict, created_by_admin: str = "adm_admin") -> dict:
    """Admin provisions an account (role: 'farmer' | 'officer' | 'admin')."""
    phone = data.get("phone", "").strip()
    name = data.get("name", "").strip()
    role = data.get("role", "officer").strip().lower()
    import secrets
    raw_pwd = data.get("password")
    if not raw_pwd or raw_pwd in ["password123", "AgriSphere@2026", "Officer@2026"]:
        raw_pwd = f"Agri@{secrets.token_urlsafe(6)}"
    
    password = raw_pwd

    if role not in ["farmer", "officer", "admin"]:
        raise ValueError("Invalid role specified. Must be 'farmer', 'officer', or 'admin'.")

    existing = db.query(User).filter(User.phone == phone).first()
    if existing:
        raise ConflictException("User with this phone number already exists")

    pwd_hash = hash_password(password)

    user = User(phone=phone, password_hash=pwd_hash, is_active=True)
    db.add(user)
    db.flush()

    profile = UserProfile(
        user_id=user.id,
        full_name=name,
        role=role,
        status="active",
        created_by=created_by_admin,
    )
    db.add(profile)
    db.flush()

    if role == "farmer":
        farmer_domain = Farmer(
            user_id=user.id,
            crop_type=data.get("crop_type"),
            land_size=float(data["land_size_acres"]) if data.get("land_size_acres") else None,
            state=data.get("state"),
            district=data.get("district"),
            village=data.get("village"),
            language=data.get("language", "en"),
        )
        db.add(farmer_domain)

    db.commit()

    return {
        "id": user.id,
        "name": profile.full_name,
        "phone": user.phone,
        "role": profile.role,
        "status": profile.status,
        "generated_password": password,
    }
