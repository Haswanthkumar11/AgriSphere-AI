"""
AgriSphere AI — Post-Harvest Intelligence Subsystem 8: History & Passport Engine
Generates official Passport ID (GRN-YYYY-XXXXX) & session metadata.
"""
import uuid
import random
from datetime import datetime


def create_harvest_session_metadata(crop_type: str, user_id: str | None = None) -> dict:
    """Generates unique session ID and official Passport ID (e.g. GRN-2026-00012)."""
    session_id = str(uuid.uuid4())
    year = datetime.now().strftime("%Y")
    seq = random.randint(1000, 9999)
    passport_id = f"GRN-{year}-{seq:05d}"
    session_code = f"HAR-{crop_type[:3].upper()}-{datetime.now().strftime('%Y%m%d%H%M%S')}"

    return {
        "session_id": session_id,
        "session_code": session_code,
        "passport_id": passport_id,
        "user_id": user_id or "usr_demo",
        "crop_type": crop_type,
        "status": "COMPLETED",
        "started_at": datetime.now(),
    }
