"""
AgriSphere AI — Owner Dashboard Service (Module 5 Service 6)
Computes clean operational metrics (Total Listings, Pending Requests, Accepted Bookings, Completed Rentals).
"""
from sqlalchemy.orm import Session
from ...models.equipment import Equipment
from ...models.booking import Booking


def get_owner_dashboard_summary(db: Session, owner_id: str = "usr_demo") -> dict:
    """Calculates clean operational metrics for Equipment Owner dashboard."""
    total_listings = db.query(Equipment).filter(Equipment.owner_id == owner_id).count()
    pending_requests = db.query(Booking).filter(Booking.owner_id == owner_id, Booking.status == "PENDING").count()
    accepted_bookings = db.query(Booking).filter(Booking.owner_id == owner_id, Booking.status.in_(["ACCEPTED", "IN_PROGRESS"])).count()
    completed_rentals = db.query(Booking).filter(Booking.owner_id == owner_id, Booking.status == "COMPLETED").count()

    return {
        "owner_id": owner_id,
        "operational_metrics": {
            "total_listings": total_listings,
            "pending_requests": pending_requests,
            "accepted_bookings": accepted_bookings,
            "completed_rentals": completed_rentals,
        },
    }
