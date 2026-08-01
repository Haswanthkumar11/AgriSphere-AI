"""
AgriSphere AI — Crop Intelligence Subsystem 3: Inference Pipeline
Coordinates model execution, preprocessor output, and bounding box / lesion extraction.
"""
import logging
import traceback
from .image_preprocessor import preprocess_image
from .model_registry import model_registry

logger = logging.getLogger("agrisphere.ai.inference_pipeline")


def run_inference(image_bytes: bytes, crop_type: str, model_key: str | None = None) -> dict:
    """
    Full inference pipeline with structured logging:
    1. Preprocesses image
    2. Retrieves active model from registry
    3. Runs prediction
    4. Attaches image metadata
    """
    logger.info(f"Image Received: Size={len(image_bytes)} bytes, Crop='{crop_type}', ModelKey='{model_key}'")
    try:
        cleaned_bytes, img_meta = preprocess_image(image_bytes)
        model = model_registry.get_model(model_key)

        logger.info(f"Model Loaded: '{model.__class__.__name__}' for crop='{crop_type}'")
        logger.info(f"Inference Started: Executing vision analysis on {img_meta['processed_width']}x{img_meta['processed_height']} image")

        prediction = model.predict(cleaned_bytes, crop_type)

        logger.info(
            f"Inference Completed: Disease='{prediction.get('disease_name')}', "
            f"Healthy={prediction.get('healthy')}, Confidence={prediction.get('confidence')}, "
            f"Elapsed={prediction.get('inference_time_ms')}ms"
        )

        prediction["image_metadata"] = img_meta
        return prediction
    except Exception as e:
        logger.error(f"Inference Failed: {str(e)}\n{traceback.format_exc()}")
        raise
