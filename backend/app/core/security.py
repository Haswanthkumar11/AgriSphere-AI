"""
AgriSphere AI — Security helpers.

All JWT creation/verification lives here so no router or service ever calls
`jwt.encode` / `jwt.decode` directly. If auth strategy changes (e.g. swap to
Supabase Auth OTP as noted in the README), this is the only file that changes.
"""
import datetime
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from .config import settings

_bearer_scheme = HTTPBearer(auto_error=False)


def create_access_token(farmer_id: str, phone: str) -> str:
    payload = {
        "sub": farmer_id,
        "phone": phone,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=settings.JWT_EXPIRY_DAYS),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


def get_current_farmer_id(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
) -> str:
    """
    Optional-auth dependency for routes that want the real logged-in farmer
    when a token is present, while still allowing the hackathon demo flow
    (unauthenticated requests) to fall back to DEMO_FARMER_ID upstream.
    Use `Depends(get_current_farmer_id)` on routes that must be protected.
    """
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    payload = decode_access_token(credentials.credentials)
    return payload["sub"]
