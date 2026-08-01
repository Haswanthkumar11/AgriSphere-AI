"""
AgriSphere AI — Base User Authentication Model (users table)
Authentication credentials only. No role or business data.
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime
from ..database.base import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    phone = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
