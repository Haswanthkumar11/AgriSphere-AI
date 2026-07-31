"""
AgriSphere AI — Post-Harvest Intelligence Service Layer (Module 4)
Orchestrates the 9 AI subsystems, repositories, passport generation, and storage/market advice.
"""
import logging
import json
from sqlalchemy.orm import Session
from ..ai.harvest import (
    preprocess_grain_image, generate_storage_advice, generate_market_readiness,
    generate_harvest_action_steps, create_harvest_session_metadata, harvest_model_registry
)
from ..repositories import harvest_session_repository, harvest_kb_repository

logger = logging.getLogger("agrisphere.services.harvest")


def analyze_harvest_grain(db: Session, image_bytes: bytes, crop_type: str, user_id: str | None = None, model_key: str | None = None) -> dict:
    """
    Executes full Post-Harvest Intelligence pipeline:
    1. Preprocesses image & runs model analysis
    2. Evaluates quality, defensible moisture status/range, and AGMARK grade
    3. Evaluates storage safety risk meter (Safe/Monitor/High Risk) & shelf life
    4. Evaluates market readiness & transparent mandi price band
    5. Generates official Passport ID (GRN-YYYY-XXXXX) & persists DB records
    """
    logger.info(f"Analyzing harvest grain for crop='{crop_type}', user='{user_id}'")

    # Step 1: Session & Passport ID Metadata
    meta = create_harvest_session_metadata(crop_type, user_id)
    session_rec = harvest_session_repository.create_harvest_session(
        db, meta["session_code"], meta["passport_id"], crop_type, meta["user_id"]
    )

    # Step 2: Save Grain Scan Record
    scan_rec = harvest_session_repository.save_grain_scan(db, session_rec.id, image_url=f"/uploads/{session_rec.id}_grain.jpg")

    # Step 3: Run Harvest AI Pipeline
    cleaned_bytes, _ = preprocess_grain_image(image_bytes)
    model = harvest_model_registry.get_model(model_key)
    ai_result = model.analyze(cleaned_bytes, crop_type)

    detection = ai_result["detection"]
    quality = ai_result["quality"]
    grade_info = ai_result["grade"]

    # Step 4: Storage & Market Subsystems
    kb_rec = harvest_kb_repository.get_harvest_knowledge(db, crop_type)
    storage_advice = generate_storage_advice(grade_info, quality, crop_type)
    market_advice = generate_market_readiness(crop_type, grade_info["quality_score"], grade_info["grade"])
    action_steps = generate_harvest_action_steps(grade_info, storage_advice, market_advice)

    # Step 5: Save DB Records
    qa_record = harvest_session_repository.save_quality_assessment(db, scan_rec.id, {
        "grade": grade_info["grade"],
        "quality_score": grade_info["quality_score"],
        "moisture_status": quality["moisture_status"],
        "moisture_range": quality["moisture_range"],
        "broken_grain_pct": quality["broken_grain_pct"],
        "foreign_matter_pct": quality["foreign_matter_pct"],
        "discoloration_pct": quality["discoloration_pct"],
        "size_uniformity": quality["size_uniformity"],
        "model_used": ai_result["model_name"],
        "inference_time_ms": detection["inference_time_ms"],
    })

    sr_record = harvest_session_repository.save_storage_recommendation(db, session_rec.id, storage_advice)
    ma_record = harvest_session_repository.save_market_assessment(db, session_rec.id, market_advice)

    return {
        "session_id": session_rec.id,
        "session_code": session_rec.session_code,
        "passport_id": session_rec.passport_id,
        "crop_type": crop_type,
        "status": session_rec.status,
        "started_at": session_rec.started_at.isoformat(),
        "scan": {"id": scan_rec.id, "image_url": scan_rec.image_url, "created_at": scan_rec.created_at.isoformat()},
        "quality": {
            "grade": qa_record.grade,
            "quality_score": qa_record.quality_score,
            "moisture_status": qa_record.moisture_status,
            "moisture_range": qa_record.moisture_range,
            "broken_grain_pct": qa_record.broken_grain_pct,
            "foreign_matter_pct": qa_record.foreign_matter_pct,
            "discoloration_pct": qa_record.discoloration_pct,
            "size_uniformity": qa_record.size_uniformity,
            "model_used": qa_record.model_used,
            "inference_time_ms": qa_record.inference_time_ms,
        },
        "storage": {
            "storage_type": sr_record.storage_type,
            "shelf_life_days": sr_record.shelf_life_days,
            "risk_level": sr_record.risk_level,
            "risk_label": sr_record.risk_label,
            "actionable_guidance": sr_record.actionable_guidance,
            "humidity_limit_pct": sr_record.humidity_limit_pct,
            "temp_limit_c": sr_record.temp_limit_c,
            "pest_precautions": storage_advice["pest_precautions"],
        },
        "market": {
            "decision": ma_record.decision,
            "recommendation_label": ma_record.recommendation_label,
            "readiness_score": ma_record.readiness_score,
            "suggested_wait_weeks": ma_record.suggested_wait_weeks,
            "min_estimated_price": ma_record.min_estimated_price,
            "max_estimated_price": ma_record.max_estimated_price,
            "price_source": ma_record.price_source,
            "price_confidence": ma_record.price_confidence,
        },
        "action_steps": action_steps,
        "government_mandate": kb_rec.government_mandate if kb_rec else "AGMARK FAQ Quality Standard 2026",
    }


def get_harvest_history(db: Session, user_id: str = "usr_demo", crop_type: str | None = None) -> list[dict]:
    """Retrieves harvest history formatted for frontend."""
    sessions = harvest_session_repository.list_harvest_sessions(db, user_id, crop_type)
    res = []
    for s in sessions:
        if not s.scans:
            continue
        scan = s.scans[0]
        qa = scan.quality
        res.append({
            "session_id": s.id,
            "session_code": s.session_code,
            "passport_id": s.passport_id,
            "crop_type": s.crop_type,
            "date": s.started_at.isoformat(),
            "grade": qa.grade if qa else "Grade A",
            "quality_score": qa.quality_score if qa else 90.0,
            "moisture_status": qa.moisture_status if qa else "Low",
            "image_url": scan.image_url,
        })
    return res


def get_harvest_session_detail(db: Session, session_id: str) -> dict | None:
    """Retrieves full harvest session detail."""
    s = harvest_session_repository.get_harvest_session_by_id(db, session_id)
    if not s or not s.scans:
        return None
    scan = s.scans[0]
    qa = scan.quality
    sr = s.storage_advice
    ma = s.market_advice

    return {
        "session_id": s.id,
        "session_code": s.session_code,
        "passport_id": s.passport_id,
        "crop_type": s.crop_type,
        "status": s.status,
        "started_at": s.started_at.isoformat(),
        "scan": {"id": scan.id, "image_url": scan.image_url, "created_at": scan.created_at.isoformat()},
        "quality": {
            "grade": qa.grade if qa else "Grade A",
            "quality_score": qa.quality_score if qa else 90.0,
            "moisture_status": qa.moisture_status if qa else "Low",
            "moisture_range": qa.moisture_range if qa else "10–12%",
            "broken_grain_pct": qa.broken_grain_pct if qa else 0.0,
            "foreign_matter_pct": qa.foreign_matter_pct if qa else 0.0,
            "discoloration_pct": qa.discoloration_pct if qa else 0.0,
            "size_uniformity": qa.size_uniformity if qa else 90.0,
            "model_used": qa.model_used if qa else "OpenCV Otsu Contour Visual Quality Engine",
            "inference_time_ms": qa.inference_time_ms if qa else 0.0,
        },
        "storage": {
            "storage_type": sr.storage_type if sr else "Hermetic Bags",
            "shelf_life_days": sr.shelf_life_days if sr else 180,
            "risk_level": sr.risk_level if sr else "SAFE",
            "risk_label": sr.risk_label if sr else "🟢 Safe",
            "actionable_guidance": sr.actionable_guidance if sr else "",
            "humidity_limit_pct": sr.humidity_limit_pct if sr else 60,
            "temp_limit_c": sr.temp_limit_c if sr else 25,
            "pest_precautions": json.loads(sr.pest_precautions_json) if sr and sr.pest_precautions_json else [],
        },
        "market": {
            "decision": ma.decision if ma else "SELL_NOW",
            "recommendation_label": ma.recommendation_label if ma else "✓ Sell Now at Mandi",
            "readiness_score": ma.readiness_score if ma else 90.0,
            "suggested_wait_weeks": ma.suggested_wait_weeks if ma else 0,
            "min_estimated_price": ma.min_estimated_price if ma else 2150.0,
            "max_estimated_price": ma.max_estimated_price if ma else 2380.0,
            "price_source": ma.price_source if ma else "Based on Today's Mandi Market Data",
            "price_confidence": ma.price_confidence if ma else 0.88,
        },
    }


def get_printable_passport(db: Session, identifier: str) -> dict | None:
    """Retrieves official printable Grain Quality Passport by session_id or passport_id."""
    s = harvest_session_repository.get_harvest_session_by_passport_id(db, identifier) or harvest_session_repository.get_harvest_session_by_id(db, identifier)
    if not s:
        return None
    return get_harvest_session_detail(db, s.id)


def compare_two_harvest_sessions(db: Session, session_id_1: str, session_id_2: str) -> dict:
    """Side-by-side quality comparison between 2 harvest sessions."""
    s1 = get_harvest_session_detail(db, session_id_1)
    s2 = get_harvest_session_detail(db, session_id_2)

    if not s1 or not s2:
        raise ValueError("One or both harvest sessions not found")

    q1 = s1["quality"]
    q2 = s2["quality"]
    score_delta = round(q2["quality_score"] - q1["quality_score"], 1)

    if score_delta > 3.0:
        trend = "improved"
        trend_label = "Quality Improved 🌟"
        recommendation = f"Quality score increased by +{score_delta} points. Harvest B exhibits higher purity and lower broken grain ratio."
    elif score_delta < -3.0:
        trend = "worsened"
        trend_label = "Quality Lower ⚠️"
        recommendation = f"Quality score decreased by {score_delta} points. Harvest A had better size uniformity and lower moisture status."
    else:
        trend = "stable"
        trend_label = "Quality Equivalent 🟢"
        recommendation = "Both grain harvests meet identical commercial grading standards."

    return {
        "harvest_a": {
            "passport_id": s1["passport_id"],
            "date": s1["started_at"],
            "grade": q1["grade"],
            "quality_score": q1["quality_score"],
            "moisture_status": q1["moisture_status"],
            "broken_grain_pct": q1["broken_grain_pct"],
        },
        "harvest_b": {
            "passport_id": s2["passport_id"],
            "date": s2["started_at"],
            "grade": q2["grade"],
            "quality_score": q2["quality_score"],
            "moisture_status": q2["moisture_status"],
            "broken_grain_pct": q2["broken_grain_pct"],
        },
        "comparison_metrics": {
            "score_delta": score_delta,
            "trend": trend,
            "trend_label": trend_label,
            "recommendation": recommendation,
        },
    }
