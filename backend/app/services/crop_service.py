"""
AgriSphere AI — Crop Intelligence Service Layer (Module 3)
Orchestrates the 10 AI subsystems, repositories, session lifecycle, advisory, and scan comparisons.
"""
import logging
from sqlalchemy.orm import Session
from ..ai.crop import (
    run_inference, evaluate_confidence, generate_advisory,
    generate_recommendations, create_session_metadata, compare_scans
)
from ..repositories import crop_session_repository, disease_kb_repository

logger = logging.getLogger("agrisphere.services.crop")


def process_crop_scan(db: Session, image_bytes: bytes, crop_type: str, user_id: str | None = None, model_key: str | None = None) -> dict:
    """
    Executes full Crop Intelligence pipeline:
    1. Preprocesses image & runs model inference (YOLOv8 default)
    2. Evaluates statistical confidence & severity
    3. Generates grounded ICAR/KVK advisory & recommended action steps
    4. Persists AISession, CropScan, DiseasePrediction, and TreatmentRecommendation records in DB
    5. Returns serialized AISession response payload
    """
    logger.info(f"Processing crop scan for crop_type='{crop_type}', user='{user_id}'")

    # Step 1: Session Metadata
    meta = create_session_metadata(crop_type, user_id)
    session_rec = crop_session_repository.create_ai_session(db, meta["session_code"], crop_type, meta["user_id"])

    # Step 2: Save Crop Scan Record
    # For demo storage, image is stored as data URL or placeholder path
    scan_rec = crop_session_repository.save_crop_scan(db, session_rec.id, image_url=f"/uploads/{session_rec.id}.jpg")

    # Step 3: Run AI Inference Pipeline
    prediction = run_inference(image_bytes, crop_type, model_key)
    conf_eval = evaluate_confidence(prediction["confidence"], prediction["affected_area_pct"])

    prediction["severity"] = conf_eval["severity"]

    # Step 4: Generate Grounded Advisory & Recommendations
    advisory = generate_advisory(prediction["disease_name"], prediction["disease_code"], crop_type, conf_eval["severity"], prediction["confidence"])
    recommendation = generate_recommendations(prediction["disease_code"], conf_eval["severity"])

    prediction["explanation"] = advisory["explanation"]

    # Step 5: Save DB Records
    pred_rec = crop_session_repository.save_disease_prediction(db, scan_rec.id, prediction)
    rec_record = crop_session_repository.save_treatment_recommendation(db, session_rec.id, recommendation)

    return {
        "session_id": session_rec.id,
        "session_code": session_rec.session_code,
        "crop_type": crop_type,
        "status": session_rec.status,
        "started_at": session_rec.started_at.isoformat(),
        "scan": {
            "id": scan_rec.id,
            "image_url": scan_rec.image_url,
            "created_at": scan_rec.created_at.isoformat(),
        },
        "prediction": {
            "disease_name": pred_rec.disease_name,
            "disease_code": pred_rec.disease_code,
            "healthy": pred_rec.healthy,
            "confidence": pred_rec.confidence,
            "confidence_pct": conf_eval["confidence_pct"],
            "severity": pred_rec.severity,
            "affected_area_pct": pred_rec.affected_area_pct,
            "model_used": pred_rec.model_used,
            "inference_time_ms": pred_rec.inference_time_ms,
            "explanation": pred_rec.explanation,
            "government_advisory": advisory["government_advisory"],
            "reliability_tier": conf_eval["reliability_tier"],
        },
        "treatment": {
            "chemical_treatment": rec_record.chemical_treatment,
            "organic_treatment": rec_record.organic_treatment,
            "preventive_measures": recommendation["preventive_measures"],
            "spray_window": rec_record.spray_window,
            "recovery_days": rec_record.recovery_days,
            "action_steps": recommendation["action_steps"],
            "is_kb_grounded": rec_record.is_kb_grounded,
        },
    }


def get_scan_history(db: Session, user_id: str = "usr_demo", crop_type: str | None = None) -> list[dict]:
    """Retrieves scan history list formatted for frontend."""
    sessions = crop_session_repository.list_sessions_for_user(db, user_id, crop_type)
    result = []
    for s in sessions:
        if not s.scans:
            continue
        scan = s.scans[0]
        pred = scan.prediction
        result.append({
            "session_id": s.id,
            "session_code": s.session_code,
            "crop_type": s.crop_type,
            "date": s.started_at.isoformat(),
            "disease_name": pred.disease_name if pred else "Unknown",
            "healthy": pred.healthy if pred else False,
            "severity": pred.severity if pred else "mild",
            "confidence_pct": round(pred.confidence * 100, 1) if pred else 0,
            "image_url": scan.image_url,
        })
    return result


def get_session_detail(db: Session, session_id: str) -> dict | None:
    """Retrieves complete details for a single AI session."""
    s = crop_session_repository.get_session_by_id(db, session_id)
    if not s or not s.scans:
        return None
    scan = s.scans[0]
    pred = scan.prediction
    rec = s.recommendations[0] if s.recommendations else None
    
    import json
    return {
        "session_id": s.id,
        "session_code": s.session_code,
        "crop_type": s.crop_type,
        "status": s.status,
        "started_at": s.started_at.isoformat(),
        "scan": {"id": scan.id, "image_url": scan.image_url, "created_at": scan.created_at.isoformat()},
        "prediction": {
            "disease_name": pred.disease_name if pred else "Unknown",
            "disease_code": pred.disease_code if pred else "unknown",
            "healthy": pred.healthy if pred else False,
            "confidence": pred.confidence if pred else 0,
            "confidence_pct": round(pred.confidence * 100, 1) if pred else 0,
            "severity": pred.severity if pred else "mild",
            "affected_area_pct": pred.affected_area_pct if pred else 0,
            "model_used": pred.model_used if pred else "YOLOv8n-cls + OpenCV",
            "inference_time_ms": pred.inference_time_ms if pred else 0,
            "explanation": pred.explanation if pred else "",
        },
        "treatment": {
            "chemical_treatment": rec.chemical_treatment if rec else None,
            "organic_treatment": rec.organic_treatment if rec else None,
            "preventive_measures": json.loads(rec.preventive_measures_json) if rec and rec.preventive_measures_json else [],
            "spray_window": rec.spray_window if rec else None,
            "recovery_days": rec.recovery_days if rec else 7,
            "action_steps": json.loads(rec.action_steps_json) if rec and rec.action_steps_json else [],
            "is_kb_grounded": rec.is_kb_grounded if rec else True,
        },
    }


def compare_two_sessions(db: Session, session_id_1: str, session_id_2: str) -> dict:
    """Side-by-side comparison between 2 session IDs."""
    detail_1 = get_session_detail(db, session_id_1)
    detail_2 = get_session_detail(db, session_id_2)

    if not detail_1 or not detail_2:
        raise ValueError("One or both sessions not found for comparison")

    return compare_scans(detail_1, detail_2)
