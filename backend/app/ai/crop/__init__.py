"""
AgriSphere AI — Crop Intelligence Module
10-subsystem AI decision support architecture.
"""
from .image_preprocessor import preprocess_image
from .model_registry import model_registry
from .inference_pipeline import run_inference
from .confidence_engine import evaluate_confidence
from .disease_kb import get_disease_knowledge, list_knowledge_base
from .advisory_engine import generate_advisory
from .recommendation_engine import generate_recommendations
from .history_engine import create_session_metadata
from .comparison_engine import compare_scans
from .voice_engine import dispatch_crop_voice_advisory

__all__ = [
    "preprocess_image",
    "model_registry",
    "run_inference",
    "evaluate_confidence",
    "get_disease_knowledge",
    "list_knowledge_base",
    "generate_advisory",
    "generate_recommendations",
    "create_session_metadata",
    "compare_scans",
    "dispatch_crop_voice_advisory",
]
