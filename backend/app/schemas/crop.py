"""
AgriSphere AI — Pydantic Schemas for Crop Intelligence (Module 3)
"""
from pydantic import BaseModel, ConfigDict
from typing import Optional, List


class DiseasePredictionSchema(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    disease_name: str
    disease_code: str
    healthy: bool
    confidence: float
    confidence_pct: float
    severity: str
    affected_area_pct: float
    model_used: str
    inference_time_ms: float
    explanation: str
    government_advisory: Optional[str] = None
    reliability_tier: Optional[str] = "HIGH"


class TreatmentSchema(BaseModel):
    chemical_treatment: Optional[str] = None
    organic_treatment: Optional[str] = None
    preventive_measures: List[str] = []
    spray_window: Optional[str] = None
    recovery_days: int = 7
    action_steps: List[str] = []
    is_kb_grounded: bool = True


class AISessionResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    session_id: str
    session_code: str
    crop_type: str
    status: str
    started_at: str
    scan: dict
    prediction: DiseasePredictionSchema
    treatment: TreatmentSchema


class ScanHistoryItemSchema(BaseModel):
    session_id: str
    session_code: str
    crop_type: str
    date: str
    disease_name: str
    healthy: bool
    severity: str
    confidence_pct: float
    image_url: str


class CompareRequestSchema(BaseModel):
    session_id_1: str
    session_id_2: str


class DiseaseKnowledgeSchema(BaseModel):
    disease_code: str
    disease_name: str
    crop_type: str
    scientific_name: Optional[str] = None
    description: Optional[str] = None
    symptoms: List[str] = []
    causes: List[str] = []
    prevention: List[str] = []
    chemical_treatment: Optional[str] = None
    organic_treatment: Optional[str] = None
    government_advisory: Optional[str] = None
    image_icon: str = "🍃"
