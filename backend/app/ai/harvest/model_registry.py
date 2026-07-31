"""
AgriSphere AI — Post-Harvest Intelligence Subsystem 9: Model Registry
Model registry for harvest visual quality engines (OpenCV Otsu default, CNN ready).
"""
from abc import ABC, abstractmethod


class BaseHarvestModel(ABC):
    @abstractmethod
    def analyze(self, image_bytes: bytes, crop_type: str) -> dict:
        pass


class OpenCVHarvestModel(BaseHarvestModel):
    def analyze(self, image_bytes: bytes, crop_type: str) -> dict:
        from .grain_detection_engine import detect_grains
        from .quality_engine import analyze_visual_quality
        from .grade_engine import classify_grade

        detection = detect_grains(image_bytes)
        quality = analyze_visual_quality(detection, crop_type)
        grade = classify_grade(quality)

        return {
            "model_name": "OpenCV Otsu Contour Visual Quality Engine",
            "model_version": "v2.1.0-cv",
            "dataset_version": "AGMARK-ICAR-2026.1",
            "detection": detection,
            "quality": quality,
            "grade": grade,
        }


class HarvestModelRegistry:
    def __init__(self):
        self._models = {"opencv": OpenCVHarvestModel()}
        self._active_key = "opencv"

    def get_model(self, key: str | None = None) -> BaseHarvestModel:
        return self._models.get(key or self._active_key, self._models[self._active_key])


harvest_model_registry = HarvestModelRegistry()
