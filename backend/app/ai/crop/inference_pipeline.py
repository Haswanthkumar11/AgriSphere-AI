"""
AgriSphere AI — Crop Intelligence Subsystem 3: Inference Pipeline
Coordinates model execution, preprocessor output, and bounding box / lesion extraction.
"""
import logging
from .image_preprocessor import preprocess_image
from .model_registry import model_registry

logger = logging.getLogger("agrisphere.ai.inference_pipeline")


def run_inference(image_bytes: bytes, crop_type: str, model_key: str | None = None) -> dict:
    """
    Full inference pipeline:
    1. Preprocesses image
    2. Retrieves active model from registry
    3. Runs prediction
    4. Attaches image metadata
    """
    cleaned_bytes, img_meta = preprocess_image(image_bytes)
    model = model_registry.get_model(model_key)

    logger.info(f"Running inference for crop='{crop_type}' using model='{model.__class__.__name__}'")
    prediction = model.predict(cleaned_bytes, crop_type)

    prediction["image_metadata"] = img_meta
    return prediction
