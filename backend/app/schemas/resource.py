"""
AgriSphere AI — Pydantic Schemas for Resource Hub & Notifications (Module 5)
"""
from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import date


class EquipmentCreateSchema(BaseModel):
    name: str
    category: str = "tractor"
    brand: Optional[str] = "Mahindra"
    model: Optional[str] = "2025"
    description: Optional[str] = None
    price_per_day: float
    price_per_hour: Optional[float] = None
    image_url: Optional[str] = None
    village: Optional[str] = "Amaravati"
    district: Optional[str] = "Guntur"
    state: Optional[str] = "Andhra Pradesh"
    operator_available: bool = False
    is_verified: bool = True
    owner_id: Optional[str] = "usr_demo"


class BookingCreateSchema(BaseModel):
    equipment_id: str
    from_date: date
    to_date: date
    purpose: str = "Harvesting"
    land_size_acres: float = 2.0
    operator_required: bool = False
    special_requirements: Optional[str] = None
    village: Optional[str] = "Amaravati"
    requester_id: Optional[str] = "usr_demo"


class BookingStatusUpdateSchema(BaseModel):
    status: str  # ACCEPTED, REJECTED, COMPLETED
