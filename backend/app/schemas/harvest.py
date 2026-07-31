"""
AgriSphere AI — Pydantic Schemas for Post-Harvest Intelligence (Module 4)
"""
from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any


class QualityAssessmentSchema(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    grade: str
    quality_score: float
    moisture_status: str
    moisture_range: str
    broken_grain_pct: float
    foreign_matter_pct: float
    discoloration_pct: float
    size_uniformity: float
    model_used: str
    inference_time_ms: float


class StorageRecommendationSchema(BaseModel):
    storage_type: str
    shelf_life_days: int
    risk_level: str
    risk_label: str
    actionable_guidance: str
    humidity_limit_pct: int
    temp_limit_c: int
    pest_precautions: List[str] = []


class MarketAssessmentSchema(BaseModel):
    decision: str
    recommendation_label: str
    readiness_score: float
    suggested_wait_weeks: int
    min_estimated_price: float
    max_estimated_price: float
    price_source: str
    price_confidence: float


class HarvestSessionResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    session_id: str
    session_code: str
    passport_id: str
    crop_type: str
    status: str
    started_at: str
    scan: Dict[str, Any]
    quality: QualityAssessmentSchema
    storage: StorageRecommendationSchema
    market: MarketAssessmentSchema
    action_steps: List[str] = []
    government_mandate: Optional[str] = None


class HarvestCompareRequestSchema(BaseModel):
    session_id_1: str
    session_id_2: str


class HarvestKnowledgeSchema(BaseModel):
    crop_type: str
    grade_standards: Dict[str, Any] = {}
    quality_parameters: Dict[str, Any] = {}
    storage_best_practices: List[str] = []
    government_mandate: Optional[str] = None
