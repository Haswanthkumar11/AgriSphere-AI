"""
AgriSphere AI — User Profile & Role Authorization Model (user_profiles table)
Maps user_id to full_name and RBAC role ('farmer' | 'officer' | 'admin').
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, ForeignKey, DateTime
from ..database.base import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="farmer") # 'farmer' | 'officer' | 'admin'
    status = Column(String, nullable=False, default="active") # 'active' | 'inactive' | 'suspended'
    created_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
