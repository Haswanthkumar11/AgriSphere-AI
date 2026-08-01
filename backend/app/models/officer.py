"""
AgriSphere AI — Extension Officer Model
Table: officers (Provisioned ONLY by Admin)
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from ..database.base import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Officer(Base):
    __tablename__ = "officers"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    employee_id = Column(String, unique=True, index=True, nullable=False) # e.g. KVK-AP-2026-042
    phone = Column(String, unique=True, index=True, nullable=False)
    district = Column(String, nullable=False, default="Tirupati")
    designation = Column(String, nullable=False, default="Senior Extension Officer")
    password_hash = Column(String, nullable=False)
    created_by_admin = Column(String, nullable=True)
    status = Column(String, default="active")                             # active / inactive
    created_at = Column(DateTime, default=datetime.utcnow)
