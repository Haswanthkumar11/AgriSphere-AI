from pydantic import BaseModel, Field
from typing import Optional


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2)
    phone: str = Field(..., min_length=10)
    password: str = Field(..., min_length=6)
    region: Optional[str] = "Tirupati, Andhra Pradesh"
    crop_type: Optional[str] = "Tomato"
    land_size_acres: Optional[float] = 1.0
    role: Optional[str] = None  # Note: Strictly ignored during registration; always assigned role='farmer'


class LoginRequest(BaseModel):
    phone: str = Field(..., min_length=10)
    password: str = Field(..., min_length=1)


class FarmerOut(BaseModel):
    id: str
    name: str
    phone: str
    region: str
    crop_type: str
    land_size_acres: float
    role: str = "farmer"


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: FarmerOut
