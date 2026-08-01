"""
AgriSphere AI — Security & Reusable RBAC Engine.

All password hashing (bcrypt), JWT creation/verification, and Role-Based Access Control (RBAC)
dependencies live here. Router controllers use `Depends(require_roles("admin"))` or equivalent.
"""
import datetime
import bcrypt
import jwt
from typing import Callable, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from .config import settings

_bearer_scheme = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    """Hashes plaintext password using bcrypt with random salt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str | None) -> bool:
    """Verifies plain password against stored bcrypt password_hash."""
    if not hashed_password:
        return False
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False


class CurrentUser:
    """Standardized user representation for RBAC verification."""
    def __init__(self, user_id: str, phone: str, role: str):
        self.id = user_id
        self.phone = phone
        self.role = role


def create_access_token(farmer_id: str, phone: str, role: str = "farmer") -> str:
    """Creates signed JWT access token with sub, phone, and role claims."""
    payload = {
        "sub": farmer_id,
        "phone": phone,
        "role": role,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=settings.JWT_EXPIRY_DAYS),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    """Decodes and validates JWT signature and expiry."""
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
) -> CurrentUser:
    """
    Dependency that extracts and verifies JWT bearer credentials,
    returning a populated `CurrentUser` object (with id, phone, role).
    Raises 401 Unauthorized if missing or invalid.
    """
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    payload = decode_access_token(credentials.credentials)
    return CurrentUser(
        user_id=payload["sub"],
        phone=payload.get("phone", ""),
        role=payload.get("role", "farmer"),
    )


def get_current_farmer_id(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
) -> str:
    """Backward compatible helper returning farmer_id string."""
    if credentials is None:
        return settings.DEMO_FARMER_ID
    payload = decode_access_token(credentials.credentials)
    return payload["sub"]


def require_roles(*allowed_roles: str) -> Callable[..., CurrentUser]:
    """
    Reusable RBAC dependency factory.
    Example usage:
      Depends(require_roles("admin"))
      Depends(require_roles("owner", "admin"))
      Depends(require_roles("officer", "admin"))
    Raises:
      401 Unauthorized if token is missing/invalid
      403 Forbidden if user's role is not in allowed_roles
    """
    def rbac_dependency(current_user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden: Access requires role in {allowed_roles}. Current role: '{current_user.role}'.",
            )
        return current_user

    return rbac_dependency
