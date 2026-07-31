"""
AgriSphere AI — Crop Intelligence Session Repository
Data access layer for AISession, CropScan, DiseasePrediction, TreatmentRecommendation.
"""
import json
from sqlalchemy.orm import Session
from ..models.crop_scan import AISession, CropScan, DiseasePrediction, TreatmentRecommendation


def create_ai_session(db: Session, session_code: str, crop_type: str, user_id: str | None = None) -> AISession:
    session = AISession(
        session_code=session_code,
        user_id=user_id or "usr_demo",
        crop_type=crop_type,
        status="COMPLETED",
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def save_crop_scan(db: Session, session_id: str, image_url: str) -> CropScan:
    scan = CropScan(session_id=session_id, image_url=image_url)
    db.add(scan)
    db.commit()
    db.refresh(scan)
    return scan


def save_disease_prediction(db: Session, scan_id: str, pred_dict: dict) -> DiseasePrediction:
    pred = DiseasePrediction(
        scan_id=scan_id,
        disease_name=pred_dict.get("disease_name", "Unknown"),
        disease_code=pred_dict.get("disease_code", "unknown"),
        healthy=pred_dict.get("healthy", False),
        confidence=pred_dict.get("confidence", 0.0),
        severity=pred_dict.get("severity", "mild"),
        affected_area_pct=pred_dict.get("affected_area_pct", 0.0),
        model_used=pred_dict.get("model_used", "YOLOv8n-cls + OpenCV"),
        inference_time_ms=pred_dict.get("inference_time_ms", 0.0),
        explanation=pred_dict.get("explanation", ""),
    )
    db.add(pred)
    db.commit()
    db.refresh(pred)
    return pred


def save_treatment_recommendation(db: Session, session_id: str, rec_dict: dict) -> TreatmentRecommendation:
    rec = TreatmentRecommendation(
        session_id=session_id,
        chemical_treatment=rec_dict.get("chemical_treatment"),
        organic_treatment=rec_dict.get("organic_treatment"),
        preventive_measures_json=json.dumps(rec_dict.get("preventive_measures", [])),
        spray_window=rec_dict.get("spray_window"),
        recovery_days=rec_dict.get("recovery_days", 7),
        action_steps_json=json.dumps(rec_dict.get("action_steps", [])),
        is_kb_grounded=rec_dict.get("is_kb_grounded", True),
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec


def list_sessions_for_user(db: Session, user_id: str, crop_type: str | None = None, limit: int = 20) -> list[AISession]:
    query = db.query(AISession).filter(AISession.user_id == user_id, AISession.is_deleted == False)
    if crop_type:
        query = query.filter(AISession.crop_type.ilike(f"%{crop_type}%"))
    return query.order_by(AISession.started_at.desc()).limit(limit).all()


def get_session_by_id(db: Session, session_id: str) -> AISession | None:
    return db.query(AISession).filter(AISession.id == session_id, AISession.is_deleted == False).first()


def soft_delete_session(db: Session, session_id: str) -> bool:
    session = get_session_by_id(db, session_id)
    if not session:
        return False
    session.is_deleted = True
    db.commit()
    return True
