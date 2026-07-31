"""
AgriSphere AI — Crop Intelligence Subsystem 8: History & Session Lifecycle Engine
Manages session code generation, audit metadata, and lifecycle formatting.
"""
import uuid
from datetime import datetime


def create_session_metadata(crop_type: str, user_id: str | None = None) -> dict:
    """Generates unique session identifiers and timestamps."""
    session_id = str(uuid.uuid4())
    session_code = f"SES-{crop_type[:3].upper()}-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    return {
        "session_id": session_id,
        "session_code": session_code,
        "user_id": user_id or "usr_demo",
        "crop_type": crop_type,
        "status": "COMPLETED",
        "started_at": datetime.now(),
    }
