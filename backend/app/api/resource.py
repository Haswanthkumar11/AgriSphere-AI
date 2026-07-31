"""
AgriSphere AI — Farm Resource Hub & Notifications API Endpoints (Module 5)
Tag: 🚜 Farm Resource Hub & Equipment Marketplace
"""
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

from ..database.session import get_db
from ..services.resource import (
    search_service, equipment_service, booking_service,
    availability_service, notification_service, owner_dashboard_service
)
from ..core.responses import success_response
from ..schemas.resource import EquipmentCreateSchema, BookingCreateSchema

router = APIRouter(prefix="/api/v1/resources", tags=["🚜 Farm Resource Hub & Equipment Marketplace"])


# ── Equipment Endpoints ──

@router.get("/equipment", summary="Search & List Equipment Listings")
def list_equipment(
    category: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    village: Optional[str] = Query(None),
    operator_available: Optional[bool] = Query(None),
    available_only: bool = Query(True),
    sort_by: Optional[str] = Query(None),  # lowest_price, highest_price, newest
    db: Session = Depends(get_db),
):
    items = search_service.search_equipment(
        db, category, district, village, operator_available, available_only, sort_by
    )
    return success_response(data=items, message="Equipment listings retrieved")


@router.get("/equipment/{equipment_id}", summary="Get Single Equipment Details & Calendar")
def get_equipment_detail(equipment_id: str, db: Session = Depends(get_db)):
    item = equipment_service.get_equipment_detail(db, equipment_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Equipment not found")
    return success_response(data=item, message="Equipment detail retrieved")


@router.post("/equipment", summary="Create New Equipment Listing (Owner)")
def create_equipment(payload: EquipmentCreateSchema, db: Session = Depends(get_db)):
    item = equipment_service.create_new_equipment(db, payload.model_dump())
    return success_response(data=item, message="Equipment listed successfully")


@router.put("/equipment/{equipment_id}/toggle-availability", summary="Toggle Equipment Available Flag (Owner)")
def toggle_equipment_availability(equipment_id: str, db: Session = Depends(get_db)):
    item = equipment_service.toggle_availability(db, equipment_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Equipment not found")
    return success_response(data=item, message="Equipment availability toggled")


@router.delete("/equipment/{equipment_id}", summary="Delete Equipment Listing (Owner)")
def delete_equipment(equipment_id: str, db: Session = Depends(get_db)):
    deleted = equipment_service.delete_equipment_listing(db, equipment_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Equipment not found")
    return success_response(data={"id": equipment_id, "deleted": True}, message="Listing deleted")


# ── Booking Endpoints ──

@router.post("/book", summary="Submit Booking Request")
def submit_booking(payload: BookingCreateSchema, db: Session = Depends(get_db)):
    try:
        res = booking_service.request_booking(db, payload.model_dump())
        return success_response(data=res, message="Booking request submitted successfully")
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))


@router.get("/bookings", summary="List Farmer's Booking History")
def get_farmer_bookings(requester_id: str = Query("usr_demo"), db: Session = Depends(get_db)):
    bkgs = booking_service.get_farmer_bookings(db, requester_id)
    return success_response(data=bkgs, message="Farmer bookings retrieved")


@router.get("/owner/requests", summary="List Incoming Booking Requests (Owner)")
def get_owner_requests(owner_id: str = Query("usr_demo"), db: Session = Depends(get_db)):
    bkgs = booking_service.get_owner_bookings(db, owner_id)
    return success_response(data=bkgs, message="Owner booking requests retrieved")


@router.get("/owner/dashboard", summary="Get Owner Operational Metrics")
def get_owner_dashboard(owner_id: str = Query("usr_demo"), db: Session = Depends(get_db)):
    summary = owner_dashboard_service.get_owner_dashboard_summary(db, owner_id)
    return success_response(data=summary, message="Owner dashboard metrics retrieved")


@router.put("/bookings/{booking_id}/accept", summary="Accept Booking Request (Owner)")
def accept_booking_endpoint(booking_id: str, db: Session = Depends(get_db)):
    try:
        res = booking_service.accept_booking(db, booking_id)
        return success_response(data=res, message="Booking accepted")
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))


@router.put("/bookings/{booking_id}/reject", summary="Reject Booking Request (Owner)")
def reject_booking_endpoint(booking_id: str, db: Session = Depends(get_db)):
    try:
        res = booking_service.reject_booking(db, booking_id)
        return success_response(data=res, message="Booking rejected")
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))


@router.put("/bookings/{booking_id}/complete", summary="Mark Booking Completed (Owner)")
def complete_booking_endpoint(booking_id: str, db: Session = Depends(get_db)):
    try:
        res = booking_service.complete_booking(db, booking_id)
        return success_response(data=res, message="Booking completed")
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))


@router.get("/bookings/{booking_id}/confirmation", summary="Get Printable Rental Confirmation Document")
def get_rental_confirmation_endpoint(booking_id: str, db: Session = Depends(get_db)):
    try:
        res = booking_service.get_rental_confirmation(db, booking_id)
        return success_response(data=res, message="Rental confirmation document retrieved")
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))


# ── Notification Center Endpoints ──

@router.get("/notifications", summary="List Platform Notifications & Unread Count")
def get_notifications(user_id: str = Query("usr_demo"), db: Session = Depends(get_db)):
    notifs = notification_service.get_user_notifications(db, user_id)
    return success_response(data=notifs, message="User notifications retrieved")


@router.put("/notifications/{notification_id}/read", summary="Mark Single Notification as Read")
def mark_read_endpoint(notification_id: str, db: Session = Depends(get_db)):
    ok = notification_service.mark_notification_read(db, notification_id)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    return success_response(data={"id": notification_id, "read": True}, message="Notification marked read")


@router.put("/notifications/read-all", summary="Mark All Notifications as Read")
def mark_all_read_endpoint(user_id: str = Query("usr_demo"), db: Session = Depends(get_db)):
    count = notification_service.mark_all_notifications_read(db, user_id)
    return success_response(data={"marked_read_count": count}, message="All notifications marked read")
