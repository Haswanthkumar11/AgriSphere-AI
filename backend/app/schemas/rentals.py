from pydantic import BaseModel


class EquipmentOut(BaseModel):
    id: str
    name: str
    category: str
    owner_name: str
    distance_km: float
    price_per_day: float
    icon: str
    available: bool


class BookRequest(BaseModel):
    equipment_id: str
    farmer_id: str = "usr_demo"


class BookingResult(BaseModel):
    booking_id: str
    status: str
    equipment_name: str
    owner_name: str
    price_per_day: float
    message: str


class BookingHistoryItem(BaseModel):
    booking_id: str
    equipment_name: str
    status: str
    created_at: str
