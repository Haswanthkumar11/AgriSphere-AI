"""
AgriSphere AI — Post-Harvest Intelligence Database Models (Module 4)
HarvestSession + GrainScan + QualityAssessment + StorageRecommendation + MarketAssessment + HarvestKnowledge.
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, Integer, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship

from ..database.base import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class HarvestSession(Base):
    __tablename__ = "harvest_sessions"

    id = Column(String, primary_key=True, default=generate_uuid)
    session_code = Column(String, unique=True, index=True, nullable=False)
    passport_id = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(String, index=True, nullable=True)
    crop_type = Column(String, nullable=False)
    status = Column(String, default="COMPLETED")
    started_at = Column(DateTime, default=datetime.utcnow)
    is_deleted = Column(Boolean, default=False)

    # Relationships
    scans = relationship("GrainScan", back_populates="session", cascade="all, delete-orphan")
    storage_advice = relationship("StorageRecommendation", back_populates="session", uselist=False, cascade="all, delete-orphan")
    market_advice = relationship("MarketAssessment", back_populates="session", uselist=False, cascade="all, delete-orphan")


class GrainScan(Base):
    __tablename__ = "grain_scans"

    id = Column(String, primary_key=True, default=generate_uuid)
    session_id = Column(String, ForeignKey("harvest_sessions.id"), nullable=False)
    image_url = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    session = relationship("HarvestSession", back_populates="scans")
    quality = relationship("QualityAssessment", back_populates="scan", uselist=False, cascade="all, delete-orphan")


class QualityAssessment(Base):
    __tablename__ = "quality_assessments"

    id = Column(String, primary_key=True, default=generate_uuid)
    scan_id = Column(String, ForeignKey("grain_scans.id"), nullable=False)
    grade = Column(String, nullable=False)                         # Grade A / B / C
    quality_score = Column(Float, nullable=False)                  # 0-100
    moisture_status = Column(String, default="Low")                 # Low / Moderate / High
    moisture_range = Column(String, default="10–12%")               # 10–12% / 12–14% / Above 14%
    broken_grain_pct = Column(Float, default=0.0)
    foreign_matter_pct = Column(Float, default=0.0)
    discoloration_pct = Column(Float, default=0.0)
    size_uniformity = Column(Float, default=90.0)
    model_used = Column(String, default="OpenCV Otsu Contour Visual Quality Engine")
    inference_time_ms = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    scan = relationship("GrainScan", back_populates="quality")


class StorageRecommendation(Base):
    __tablename__ = "storage_recommendations"

    id = Column(String, primary_key=True, default=generate_uuid)
    session_id = Column(String, ForeignKey("harvest_sessions.id"), nullable=False)
    storage_type = Column(String, nullable=False)
    shelf_life_days = Column(Integer, default=180)
    risk_level = Column(String, default="SAFE")                    # SAFE / MONITOR / HIGH_RISK
    risk_label = Column(String, default="🟢 Safe")                 # 🟢 Safe / 🟡 Monitor / 🔴 High Risk
    actionable_guidance = Column(Text, nullable=True)
    humidity_limit_pct = Column(Integer, default=60)
    temp_limit_c = Column(Integer, default=25)
    pest_precautions_json = Column(Text, nullable=True)            # JSON string list
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    session = relationship("HarvestSession", back_populates="storage_advice")


class MarketAssessment(Base):
    __tablename__ = "market_assessments"

    id = Column(String, primary_key=True, default=generate_uuid)
    session_id = Column(String, ForeignKey("harvest_sessions.id"), nullable=False)
    decision = Column(String, default="SELL_NOW")                  # SELL_NOW / STORE
    recommendation_label = Column(String, nullable=False)          # e.g. "✓ Sell Now at Mandi"
    readiness_score = Column(Float, default=90.0)
    suggested_wait_weeks = Column(Integer, default=0)
    min_estimated_price = Column(Float, nullable=False)
    max_estimated_price = Column(Float, nullable=False)
    price_source = Column(String, default="Based on Today's Mandi Market Data")
    price_confidence = Column(Float, default=0.88)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    session = relationship("HarvestSession", back_populates="market_advice")


class HarvestKnowledge(Base):
    __tablename__ = "harvest_knowledge_base"

    id = Column(String, primary_key=True, default=generate_uuid)
    crop_type = Column(String, unique=True, index=True, nullable=False)
    grade_standards_json = Column(Text, nullable=True)            # JSON string
    quality_parameters_json = Column(Text, nullable=True)          # JSON: {max_moisture_pct, max_broken_pct, max_foreign_matter_pct}
    storage_best_practices_json = Column(Text, nullable=True)      # JSON string
    government_mandate = Column(Text, nullable=True)
