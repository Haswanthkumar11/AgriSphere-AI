"""
AgriSphere AI — Admin Model
Table: admins (Provisioned by Superadmin / Seed only)
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from ..database.base import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Admin(Base):
    __tablename__ = "admins"

    id = Column(String, primary_key=True, default=generate_uuid)
    username = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    created_by = Column(String, nullable=True, default="SYSTEM")
    created_at = Column(DateTime, default=datetime.utcnow)
