"""
AgriSphere AI — Crop Intelligence Database Models (Module 3)
AISession container + CropScan + DiseasePrediction + TreatmentRecommendation + DiseaseKnowledge.
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, Integer, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship

from ..database.base import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class AISession(Base):
    __tablename__ = "ai_sessions"

    id = Column(String, primary_key=True, default=generate_uuid)
    session_code = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(String, index=True, nullable=True)
    crop_type = Column(String, nullable=False)
    status = Column(String, default="COMPLETED")
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, default=datetime.utcnow)
    is_deleted = Column(Boolean, default=False)

    # Relationships
    scans = relationship("CropScan", back_populates="session", cascade="all, delete-orphan")
    recommendations = relationship("TreatmentRecommendation", back_populates="session", cascade="all, delete-orphan")


class CropScan(Base):
    __tablename__ = "crop_scans"

    id = Column(String, primary_key=True, default=generate_uuid)
    session_id = Column(String, ForeignKey("ai_sessions.id"), nullable=False)
    image_url = Column(String, nullable=False)
    image_hash = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_deleted = Column(Boolean, default=False)

    # Relationships
    session = relationship("AISession", back_populates="scans")
    prediction = relationship("DiseasePrediction", back_populates="scan", uselist=False, cascade="all, delete-orphan")


class DiseasePrediction(Base):
    __tablename__ = "disease_predictions"

    id = Column(String, primary_key=True, default=generate_uuid)
    scan_id = Column(String, ForeignKey("crop_scans.id"), nullable=False)
    disease_name = Column(String, nullable=False)
    disease_code = Column(String, nullable=False)
    healthy = Column(Boolean, default=False)
    confidence = Column(Float, nullable=False)
    severity = Column(String, default="mild")
    affected_area_pct = Column(Float, default=0.0)
    model_used = Column(String, default="YOLOv8n-cls + OpenCV")
    inference_time_ms = Column(Float, default=0.0)
    explanation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    scan = relationship("CropScan", back_populates="prediction")


class TreatmentRecommendation(Base):
    __tablename__ = "treatment_recommendations"

    id = Column(String, primary_key=True, default=generate_uuid)
    session_id = Column(String, ForeignKey("ai_sessions.id"), nullable=False)
    chemical_treatment = Column(Text, nullable=True)
    organic_treatment = Column(Text, nullable=True)
    preventive_measures_json = Column(Text, nullable=True)   # JSON string
    spray_window = Column(String, nullable=True)
    recovery_days = Column(Integer, default=7)
    action_steps_json = Column(Text, nullable=True)          # JSON string
    is_kb_grounded = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    session = relationship("AISession", back_populates="recommendations")


class DiseaseKnowledge(Base):
    __tablename__ = "disease_knowledge_base"

    id = Column(String, primary_key=True, default=generate_uuid)
    disease_code = Column(String, unique=True, index=True, nullable=False)
    disease_name = Column(String, nullable=False)
    crop_type = Column(String, nullable=False)
    scientific_name = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    symptoms_json = Column(Text, nullable=True)             # JSON string
    causes_json = Column(Text, nullable=True)               # JSON string
    prevention_json = Column(Text, nullable=True)           # JSON string
    chemical_treatment = Column(Text, nullable=True)
    organic_treatment = Column(Text, nullable=True)
    government_advisory = Column(Text, nullable=True)
    image_icon = Column(String, default="🍃")
