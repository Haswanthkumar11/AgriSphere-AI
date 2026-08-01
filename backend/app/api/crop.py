"""
AgriSphere AI — Crop Intelligence API Endpoints (Module 3)
POST   /api/v1/crop/scan — Scan leaf, run Hybrid AI Architecture pipeline, create AISession
GET    /api/v1/crop/history — Get scan history (with crop filter)
GET    /api/v1/crop/session/{session_id} — Get full session details
DELETE /api/v1/crop/session/{session_id} — Soft delete session
POST   /api/v1/crop/compare — Compare 2 sessions side-by-side
GET    /api/v1/crop/knowledge-base — List disease knowledge base entries
GET    /api/v1/crop/knowledge-base/{disease_code} — Get disease knowledge card
GET    /api/v1/crop/rag-stats — Get ChromaDB vector store collection stats
"""
from fastapi import APIRouter, Depends, UploadFile, File, Form, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from ..database.session import get_db
from ..services import crop_service
from ..repositories import crop_session_repository, disease_kb_repository
from ..core.responses import success_response
from ..schemas.crop import CompareRequestSchema
from ..ai.chroma_db_engine import chroma_vector_store

router = APIRouter(prefix="/api/v1/crop", tags=["Crop Intelligence"])


@router.post("/scan", summary="Scan crop leaf & start AI session")
async def scan_crop(
    file: UploadFile = File(...),
    crop_type: str = Form("Tomato"),
    model_key: Optional[str] = Form("yolov8"),
    user_id: Optional[str] = Form("usr_demo"),
    db: Session = Depends(get_db),
):
    """
    Submits crop leaf photo for full Crop Intelligence decision support.
    Runs Hybrid AI Architecture: OpenCV Preprocessor -> YOLO Crop Localization -> Gemini Vision Reasoner -> ChromaDB RAG Vector Retrieval -> Grounded Synthesizer.
    """
    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded image file is empty")

    try:
        result = crop_service.process_crop_scan(db, image_bytes, crop_type, user_id, model_key)
        return success_response(data=result, message="Crop intelligence scan completed successfully")
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Crop scan pipeline error: {str(e)}")


@router.get("/history", summary="List scan history for farmer")
def get_history(
    user_id: str = Query("usr_demo"),
    crop_type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    history = crop_service.get_scan_history(db, user_id, crop_type)
    return success_response(data=history, message="Scan history retrieved")


@router.get("/session/{session_id}", summary="Get full AI session detail")
def get_session(session_id: str, db: Session = Depends(get_db)):
    detail = crop_service.get_session_detail(db, session_id)
    if not detail:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="AI Session not found")
    return success_response(data=detail, message="Session details retrieved")


@router.delete("/session/{session_id}", summary="Soft delete an AI session")
def delete_session(session_id: str, db: Session = Depends(get_db)):
    deleted = crop_session_repository.soft_delete_session(db, session_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    return success_response(data={"session_id": session_id, "deleted": True}, message="Session deleted")


@router.post("/compare", summary="Side-by-side scan comparison")
def compare_sessions(payload: CompareRequestSchema, db: Session = Depends(get_db)):
    try:
        comparison = crop_service.compare_two_sessions(db, payload.session_id_1, payload.session_id_2)
        return success_response(data=comparison, message="Scan comparison generated")
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))


@router.get("/knowledge-base", summary="List disease knowledge base entries")
def get_knowledge_base(db: Session = Depends(get_db)):
    entries = disease_kb_repository.list_all_disease_knowledge(db)
    import json
    formatted = [
        {
            "disease_code": e.disease_code,
            "disease_name": e.disease_name,
            "crop_type": e.crop_type,
            "scientific_name": e.scientific_name,
            "description": e.description,
            "symptoms": json.loads(e.symptoms_json) if e.symptoms_json else [],
            "causes": json.loads(e.causes_json) if e.causes_json else [],
            "prevention": json.loads(e.prevention_json) if e.prevention_json else [],
            "chemical_treatment": e.chemical_treatment,
            "organic_treatment": e.organic_treatment,
            "government_advisory": e.government_advisory,
            "image_icon": e.image_icon,
        }
        for e in entries
    ]
    return success_response(data=formatted, message="Knowledge base retrieved")


@router.get("/knowledge-base/{disease_code}", summary="Get disease knowledge card")
def get_disease_card(disease_code: str, db: Session = Depends(get_db)):
    e = disease_kb_repository.get_disease_by_code(db, disease_code)
    if not e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Disease record not found")
    import json
    data = {
        "disease_code": e.disease_code,
        "disease_name": e.disease_name,
        "crop_type": e.crop_type,
        "scientific_name": e.scientific_name,
        "description": e.description,
        "symptoms": json.loads(e.symptoms_json) if e.symptoms_json else [],
        "causes": json.loads(e.causes_json) if e.causes_json else [],
        "prevention": json.loads(e.prevention_json) if e.prevention_json else [],
        "chemical_treatment": e.chemical_treatment,
        "organic_treatment": e.organic_treatment,
        "government_advisory": e.government_advisory,
        "image_icon": e.image_icon,
    }
    return success_response(data=data, message="Disease card retrieved")


@router.get("/rag-stats", summary="Get ChromaDB vector store collection stats")
def get_rag_stats():
    stats = chroma_vector_store.get_stats()
    return success_response(data=stats, message="ChromaDB RAG vector store stats retrieved")
