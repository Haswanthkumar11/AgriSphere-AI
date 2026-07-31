"""
AgriSphere AI — Equipment Model (Module 5)
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from ..database.base import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(String, primary_key=True, default=generate_uuid)
    owner_id = Column(String, ForeignKey("farmers.id"), nullable=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)            # tractor, harvester, trailer, irrigation, seeder, rotavator, thresher, sprayer, cultivator, other
    brand = Column(String, nullable=True)
    model = Column(String, nullable=True)
    description = Column(String, nullable=True)
    price_per_day = Column(Float, nullable=False)
    price_per_hour = Column(Float, nullable=True)
    image_url = Column(String, nullable=True)
    village = Column(String, nullable=True, default="Amaravati")
    district = Column(String, nullable=True, default="Guntur")
    state = Column(String, nullable=True, default="Andhra Pradesh")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    is_available = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=True)           # Verified Owner Badge
    operator_available = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    owner = relationship("Farmer")
    bookings = relationship("Booking", back_populates="equipment", cascade="all, delete-orphan")
