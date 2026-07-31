from pydantic import BaseModel


class LoginRequest(BaseModel):
    phone: str
    password: str | None = None
    name: str | None = None


class FarmerOut(BaseModel):
    id: str
    name: str
    region: str
    crop_type: str
    land_size_acres: float


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: FarmerOut
