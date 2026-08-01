from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import text

from ..database.session import get_db
from ..core.responses import success_response
from ..core.security import get_current_user, CurrentUser
from ..schemas.auth import RegisterRequest, LoginRequest
from ..services import auth_service
from ..repositories import farmer_repository

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED, summary="Register New Farmer Account")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """Registers a new account. Ignores incoming role overrides and defaults to role='farmer'."""
    result = auth_service.register_user(db, payload.model_dump())
    return success_response(data=result, message="Account registered successfully", status_code=201)


@router.post("/login", summary="User Login & JWT Issuance")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Authenticates credentials against stored bcrypt password_hash and issues JWT."""
    result = auth_service.login_user(db, phone=payload.phone, password=payload.password)
    return success_response(data=result, message="Login successful")


@router.get("/me", summary="Get Current User Profile")
def get_me(current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    """Returns current authenticated user profile."""
    farmer = farmer_repository.get_by_id(db, current_user.id)
    if not farmer:
        return success_response(
            data={"id": current_user.id, "phone": current_user.phone, "role": current_user.role},
            message="User profile retrieved",
        )
    return success_response(
        data={
            "id": farmer.id,
            "name": farmer.name,
            "phone": farmer.phone,
            "role": farmer.role,
            "region": farmer.region,
            "crop_type": farmer.crop_type,
            "land_size_acres": farmer.land_size_acres,
        },
        message="User profile retrieved",
    )


@router.get("/users", summary="List All Registered Users")
def list_users(db: Session = Depends(get_db)):
    """Returns list of registered database users."""
    users = farmer_repository.list_all(db)
    formatted = [
        {
            "id": u.id,
            "name": u.name,
            "phone": u.phone,
            "role": u.role,
            "region": u.region,
            "crop_type": u.crop_type,
            "land_size_acres": u.land_size_acres,
            "status": "active",
        }
        for u in users
    ]
    return success_response(data=formatted, message="Registered users retrieved")


@router.get("/admin-stats", summary="Get Real Database Admin Stats")
def get_admin_stats(db: Session = Depends(get_db)):
    """Queries real live database table counts for Admin Dashboard."""
    total_farmers = db.execute(text("SELECT COUNT(*) FROM farmers WHERE role IN ('farmer', 'admin');")).scalar() or 0
    total_owners = db.execute(text("SELECT COUNT(*) FROM farmers WHERE role = 'owner';")).scalar() or 0
    active_bookings = db.execute(text("SELECT COUNT(*) FROM bookings WHERE status IN ('ACCEPTED', 'IN_PROGRESS');")).scalar() or 0
    crop_scans_cnt = db.execute(text("SELECT COUNT(*) FROM ai_sessions;")).scalar() or 0
    harvest_scans_cnt = db.execute(text("SELECT COUNT(*) FROM harvest_sessions;")).scalar() or 0
    
    return success_response(
        data={
            "totalFarmers": total_farmers,
            "totalEquipOwners": total_owners,
            "activeBookings": active_bookings,
            "aiRequests": crop_scans_cnt + harvest_scans_cnt,
        },
        message="Admin statistics retrieved",
    )
