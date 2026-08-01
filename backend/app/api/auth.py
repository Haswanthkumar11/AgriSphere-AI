"""
AgriSphere AI — Authentication & Role Provisioning Endpoints
Farmer Self-Registration / Officer Admin Provisioning / Admin Management
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel

from ..database.session import get_db
from ..core.responses import success_response
from ..core.security import get_current_user, CurrentUser, verify_password, create_access_token
from ..schemas.auth import RegisterRequest, LoginRequest
from ..services import auth_service
from ..repositories import farmer_repository, officer_repository

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


class OfficerProvisionRequest(BaseModel):
    name: str
    employee_id: str
    phone: str
    district: str = "Tirupati"
    designation: str = "Senior Extension Officer"
    password: str = "Officer@2026"


class OfficerLoginRequest(BaseModel):
    employee_id_or_phone: str
    password: str


@router.post("/register", status_code=status.HTTP_201_CREATED, summary="Farmer Self-Registration")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """Farmers self-register here."""
    result = auth_service.register_user(db, payload.model_dump())
    return success_response(data=result, message="Farmer account created successfully", status_code=201)


@router.post("/login", summary="Farmer Login & JWT Issuance")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Farmer Login."""
    result = auth_service.login_user(db, phone=payload.phone, password=payload.password)
    return success_response(data=result, message="Login successful")


@router.post("/officer-login", summary="Extension Officer Login")
def officer_login(payload: OfficerLoginRequest, db: Session = Depends(get_db)):
    """Extension Officers login via Employee ID or Phone."""
    inp = payload.employee_id_or_phone.strip()
    officer = officer_repository.get_by_employee_id(db, inp) or officer_repository.get_by_phone(db, inp)
    
    if not officer or not verify_password(payload.password, officer.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Officer Employee ID or Password")

    token = create_access_token(officer.id, officer.phone, role="officer")
    return success_response(
        data={
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": officer.id,
                "name": officer.name,
                "employee_id": officer.employee_id,
                "phone": officer.phone,
                "role": "officer",
                "district": officer.district,
                "designation": officer.designation,
            },
        },
        message="Officer login successful",
    )


@router.post("/admin-login", summary="Admin Login")
def admin_login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Admin login (phone: 8310557227)."""
    farmer = farmer_repository.get_by_phone(db, payload.phone)
    if not farmer or farmer.role != "admin" or not verify_password(payload.password, farmer.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Admin Credentials")

    token = create_access_token(farmer.id, farmer.phone, role="admin")
    return success_response(
        data={
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": farmer.id,
                "name": farmer.name,
                "phone": farmer.phone,
                "role": "admin",
            },
        },
        message="Admin login successful",
    )


@router.get("/me", summary="Get Current User Profile")
def get_me(current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
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


@router.get("/users", summary="List All Farmers")
def list_users(db: Session = Depends(get_db)):
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
    return success_response(data=formatted, message="Registered farmers retrieved")


# ── Officer Provisioning Routes (Admin Only) ──
@router.post("/officers", summary="Admin Provision New Extension Officer")
def provision_officer(payload: OfficerProvisionRequest, db: Session = Depends(get_db)):
    """Admin provisions an extension officer account."""
    existing_emp = officer_repository.get_by_employee_id(db, payload.employee_id)
    if existing_emp:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Officer Employee ID already exists")

    officer = officer_repository.create_officer(db, payload.model_dump(), created_by_admin="adm_admin")
    return success_response(
        data={
            "id": officer.id,
            "name": officer.name,
            "employee_id": officer.employee_id,
            "phone": officer.phone,
            "district": officer.district,
            "designation": officer.designation,
            "status": officer.status,
        },
        message="Officer account provisioned successfully",
        status_code=201,
    )


@router.get("/officers", summary="List Provisioned Extension Officers")
def list_officers(db: Session = Depends(get_db)):
    officers = officer_repository.list_all_officers(db)
    formatted = [
        {
            "id": o.id,
            "name": o.name,
            "employee_id": o.employee_id,
            "phone": o.phone,
            "district": o.district,
            "designation": o.designation,
            "status": o.status,
            "created_at": o.created_at.isoformat(),
        }
        for o in officers
    ]
    return success_response(data=formatted, message="Extension officers retrieved")


@router.delete("/officers/{officer_id}", summary="Revoke Extension Officer Account")
def revoke_officer(officer_id: str, db: Session = Depends(get_db)):
    success = officer_repository.delete_officer(db, officer_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Officer not found")
    return success_response(data={"officer_id": officer_id}, message="Officer account revoked")


@router.get("/admin-stats", summary="Get Real Database Admin Stats")
def get_admin_stats(db: Session = Depends(get_db)):
    from sqlalchemy import text
    total_farmers = db.execute(text("SELECT COUNT(*) FROM farmers WHERE role IN ('farmer', 'admin');")).scalar() or 0
    total_officers = db.execute(text("SELECT COUNT(*) FROM officers;")).scalar() or 0
    active_bookings = db.execute(text("SELECT COUNT(*) FROM bookings WHERE status IN ('ACCEPTED', 'IN_PROGRESS');")).scalar() or 0
    crop_scans_cnt = db.execute(text("SELECT COUNT(*) FROM ai_sessions;")).scalar() or 0
    harvest_scans_cnt = db.execute(text("SELECT COUNT(*) FROM harvest_sessions;")).scalar() or 0
    
    return success_response(
        data={
            "totalFarmers": total_farmers,
            "totalOfficers": total_officers,
            "activeBookings": active_bookings,
            "aiRequests": crop_scans_cnt + harvest_scans_cnt,
        },
        message="Admin statistics retrieved",
    )
