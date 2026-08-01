"""
AgriSphere AI — Farmer Domain Model (farmers table)
Contains agricultural metadata for Farmers (linked to users.id via user_id).
No passwords, credentials, or role columns.
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from ..database.base import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    crop_type = Column(String, default="Tomato", nullable=False)
    land_size = Column(Float, default=1.0, nullable=False)
    language = Column(String, default="en", nullable=False)
    preferred_units = Column(String, default="acres", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
