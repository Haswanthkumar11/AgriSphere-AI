from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ..database.session import get_db
from ..core.responses import success_response
from ..core.security import get_current_user, CurrentUser
from ..schemas.auth import RegisterRequest, LoginRequest
from ..services import auth_service
from ..repositories import farmer_repository

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


class ProvisionUserRequest(BaseModel):
    name: str
    phone: str
    role: str = "officer" # 'farmer' | 'officer' | 'admin'
    password: str = "password123"
    crop_type: str = "Tomato"
    land_size_acres: float = 1.0


@router.post("/register", status_code=status.HTTP_201_CREATED, summary="Farmer Self-Registration")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """Farmers self-register here."""
    result = auth_service.register_user(db, payload.model_dump())
    return success_response(data=result, message="Farmer account registered successfully", status_code=201)


@router.post("/login", summary="Unified Login for Farmers, Officers, and Admins")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Authenticates credentials against users table and returns JWT + user role payload."""
    result = auth_service.login_user(db, phone=payload.phone, password=payload.password)
    return success_response(data=result, message="Login successful")


@router.post("/admin-login", summary="Legacy Admin Login Compatibility Route")
def admin_login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Delegates to unified login."""
    return login(payload, db)


@router.post("/officer-login", summary="Legacy Officer Login Compatibility Route")
def officer_login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Delegates to unified login."""
    return login(payload, db)


@router.get("/me", summary="Get Current User Profile")
def get_me(current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    user = farmer_repository.get_user_by_id(db, current_user.id)
    profile = farmer_repository.get_profile_by_user_id(db, current_user.id) if user else None
    farmer_domain = farmer_repository.get_farmer_by_user_id(db, current_user.id) if user else None

    return success_response(
        data={
            "id": current_user.id,
            "name": profile.full_name if profile else "User",
            "phone": current_user.phone,
            "role": profile.role if profile else current_user.role,
            "crop_type": farmer_domain.crop_type if farmer_domain else "Tomato",
            "land_size_acres": farmer_domain.land_size if farmer_domain else 1.0,
        },
        message="User profile retrieved",
    )


@router.get("/users", summary="List All Users")
def list_users(db: Session = Depends(get_db)):
    users = farmer_repository.list_all_farmers(db)
    return success_response(data=users, message="Registered users retrieved")


@router.post("/provision", summary="Admin Provision Account (Farmer / Officer / Admin)")
def provision_account(payload: ProvisionUserRequest, db: Session = Depends(get_db)):
    result = auth_service.provision_user(db, payload.model_dump(), created_by_admin="adm_admin")
    return success_response(data=result, message=f"User provisioned with role '{payload.role}'", status_code=201)


@router.get("/admin-stats", summary="Get Real Database Admin Stats")
def get_admin_stats(db: Session = Depends(get_db)):
    from sqlalchemy import text
    total_farmers = db.execute(text("SELECT COUNT(*) FROM user_profiles WHERE role = 'farmer';")).scalar() or 0
    total_officers = db.execute(text("SELECT COUNT(*) FROM user_profiles WHERE role = 'officer';")).scalar() or 0
    total_admins = db.execute(text("SELECT COUNT(*) FROM user_profiles WHERE role = 'admin';")).scalar() or 0
    active_bookings = db.execute(text("SELECT COUNT(*) FROM bookings WHERE status IN ('ACCEPTED', 'IN_PROGRESS');")).scalar() or 0
    crop_scans_cnt = db.execute(text("SELECT COUNT(*) FROM ai_sessions;")).scalar() or 0
    harvest_scans_cnt = db.execute(text("SELECT COUNT(*) FROM harvest_sessions;")).scalar() or 0
    
    return success_response(
        data={
            "totalFarmers": total_farmers,
            "totalOfficers": total_officers,
            "totalAdmins": total_admins,
            "activeBookings": active_bookings,
            "aiRequests": crop_scans_cnt + harvest_scans_cnt,
        },
        message="Admin statistics retrieved",
    )
