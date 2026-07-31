"""
AgriSphere AI — Post-Harvest Session Repository
Data access layer for HarvestSession, GrainScan, QualityAssessment, StorageRecommendation, MarketAssessment.
"""
import json
from sqlalchemy.orm import Session
from ..models.harvest import HarvestSession, GrainScan, QualityAssessment, StorageRecommendation, MarketAssessment


def create_harvest_session(db: Session, session_code: str, passport_id: str, crop_type: str, user_id: str | None = None) -> HarvestSession:
    session = HarvestSession(
        session_code=session_code,
        passport_id=passport_id,
        user_id=user_id or "usr_demo",
        crop_type=crop_type,
        status="COMPLETED",
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def save_grain_scan(db: Session, session_id: str, image_url: str) -> GrainScan:
    scan = GrainScan(session_id=session_id, image_url=image_url)
    db.add(scan)
    db.commit()
    db.refresh(scan)
    return scan


def save_quality_assessment(db: Session, scan_id: str, quality_dict: dict) -> QualityAssessment:
    qa = QualityAssessment(
        scan_id=scan_id,
        grade=quality_dict.get("grade", "Grade A"),
        quality_score=quality_dict.get("quality_score", 90.0),
        moisture_status=quality_dict.get("moisture_status", "Low"),
        moisture_range=quality_dict.get("moisture_range", "10–12%"),
        broken_grain_pct=quality_dict.get("broken_grain_pct", 0.0),
        foreign_matter_pct=quality_dict.get("foreign_matter_pct", 0.0),
        discoloration_pct=quality_dict.get("discoloration_pct", 0.0),
        size_uniformity=quality_dict.get("size_uniformity", 92.0),
        model_used=quality_dict.get("model_used", "OpenCV Otsu Contour Visual Quality Engine"),
        inference_time_ms=quality_dict.get("inference_time_ms", 0.0),
    )
    db.add(qa)
    db.commit()
    db.refresh(qa)
    return qa


def save_storage_recommendation(db: Session, session_id: str, storage_dict: dict) -> StorageRecommendation:
    sr = StorageRecommendation(
        session_id=session_id,
        storage_type=storage_dict.get("storage_type", "Hermetic Grain Bags (PICS)"),
        shelf_life_days=storage_dict.get("shelf_life_days", 180),
        risk_level=storage_dict.get("risk_level", "SAFE"),
        risk_label=storage_dict.get("risk_label", "🟢 Safe"),
        actionable_guidance=storage_dict.get("actionable_guidance", ""),
        humidity_limit_pct=storage_dict.get("humidity_limit_pct", 60),
        temp_limit_c=storage_dict.get("temp_limit_c", 25),
        pest_precautions_json=json.dumps(storage_dict.get("pest_precautions", [])),
    )
    db.add(sr)
    db.commit()
    db.refresh(sr)
    return sr


def save_market_assessment(db: Session, session_id: str, market_dict: dict) -> MarketAssessment:
    ma = MarketAssessment(
        session_id=session_id,
        decision=market_dict.get("decision", "SELL_NOW"),
        recommendation_label=market_dict.get("recommendation_label", "✓ Sell Now at Mandi"),
        readiness_score=market_dict.get("readiness_score", 90.0),
        suggested_wait_weeks=market_dict.get("suggested_wait_weeks", 0),
        min_estimated_price=market_dict.get("min_estimated_price", 2150.0),
        max_estimated_price=market_dict.get("max_estimated_price", 2380.0),
        price_source=market_dict.get("price_source", "Based on Today's Mandi Market Data"),
        price_confidence=market_dict.get("price_confidence", 0.88),
    )
    db.add(ma)
    db.commit()
    db.refresh(ma)
    return ma


def list_harvest_sessions(db: Session, user_id: str, crop_type: str | None = None, limit: int = 20) -> list[HarvestSession]:
    query = db.query(HarvestSession).filter(HarvestSession.user_id == user_id, HarvestSession.is_deleted == False)
    if crop_type:
        query = query.filter(HarvestSession.crop_type.ilike(f"%{crop_type}%"))
    return query.order_by(HarvestSession.started_at.desc()).limit(limit).all()


def get_harvest_session_by_id(db: Session, session_id: str) -> HarvestSession | None:
    return db.query(HarvestSession).filter(HarvestSession.id == session_id, HarvestSession.is_deleted == False).first()


def get_harvest_session_by_passport_id(db: Session, passport_id: str) -> HarvestSession | None:
    return db.query(HarvestSession).filter(HarvestSession.passport_id == passport_id, HarvestSession.is_deleted == False).first()


def soft_delete_harvest_session(db: Session, session_id: str) -> bool:
    session = get_harvest_session_by_id(db, session_id)
    if not session:
        return False
    session.is_deleted = True
    db.commit()
    return True
