"""
AgriSphere AI — Notification Model (Module 5)
Event-driven platform notification entity.
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey

from ..database.base import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    type = Column(String, nullable=False)        # BOOKING_REQUEST, BOOKING_ACCEPTED, BOOKING_REJECTED, BOOKING_COMPLETED, CROP_SCAN, GRAIN_PASSPORT
    reference_id = Column(String, nullable=True) # Optional booking / session ID
    link_url = Column(String, nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
