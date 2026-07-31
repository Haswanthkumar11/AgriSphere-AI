"""
AgriSphere AI — Booking Model (Module 5)
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from ..database.base import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, default=generate_uuid)
    booking_code = Column(String, unique=True, index=True, nullable=False)  # BKG-YYYY-XXXXX
    equipment_id = Column(String, ForeignKey("equipment.id"), nullable=False)
    owner_id = Column(String, ForeignKey("farmers.id"), nullable=False)
    requester_id = Column(String, ForeignKey("farmers.id"), nullable=False)
    from_date = Column(Date, nullable=False)
    to_date = Column(Date, nullable=False)
    purpose = Column(String, default="Harvesting")                          # Land Preparation, Sowing, Harvesting, Transportation, Spraying, Other
    land_size_acres = Column(Float, default=2.0)
    operator_required = Column(Boolean, default=False)
    special_requirements = Column(Text, nullable=True)                      # e.g., "Need rotavator attachment"
    village = Column(String, default="Amaravati")
    status = Column(String, default="PENDING")                              # PENDING, ACCEPTED, IN_PROGRESS, COMPLETED, REJECTED
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    equipment = relationship("Equipment", back_populates="bookings")
