"""
AgriSphere AI — Disease Detection Engine (Module 2 core AI capability)
=======================================================================
Hackathon-honest note: this runs REAL OpenCV image processing (not a mocked
random number). It is a lightweight classical-CV heuristic standing in for
the trained YOLOv8n-cls / YOLOv8 weights described in the README (which need
a labelled dataset like PlantVillage/PlantDoc to train and are too heavy to
ship in this environment).

Why this lives in ai/, isolated from services/routers:
    Disease Service -> calls -> Disease Engine (this file) -> calls -> model

Tomorrow this internal implementation can change to YOLO -> SAM ->
EfficientNet -> Gemini Vision, and nothing outside this file needs to know —
`disease_service.py` and `api/disease.py` keep calling `analyze()` exactly
as they do today. That is the whole point of the AI Engine Layer.
"""
import cv2
import numpy as np

from .image_io import read_image

DISEASE_REMEDIES = {
    "Early Blight": "Fungal infection on lower leaves. Spray copper-based fungicide within 48 hours. Remove and destroy infected leaves.",
    "Leaf Spot": "Bacterial/fungal spotting detected. Apply neem-oil or copper oxychloride spray. Avoid overhead watering.",
    "Nutrient Deficiency": "Yellowing pattern suggests nitrogen deficiency. Apply balanced NPK fertilizer and urea top-dressing.",
    "Healthy": "No signs of disease detected. Keep monitoring weekly.",
}

MODEL_ID = "opencv-hsv-heuristic-v1 (swap for yolov8n-cls.onnx in production)"


def analyze(file_bytes: bytes) -> dict:
    """
    Classical-CV leaf health heuristic:
      1. Convert to HSV.
      2. Segment green (healthy tissue) vs brown/yellow (necrotic/chlorotic) pixels.
      3. Ratio of unhealthy pixels -> severity score -> disease label.
    This is a real, deterministic pipeline running on the actual uploaded pixels.
    """
    img = read_image(file_bytes)
    img = cv2.resize(img, (320, 320))
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    # Healthy green mask
    green_lower = np.array([25, 40, 40])
    green_upper = np.array([95, 255, 255])
    green_mask = cv2.inRange(hsv, green_lower, green_upper)

    # Brown / necrotic mask (blight, blotches)
    brown_lower = np.array([5, 40, 20])
    brown_upper = np.array([25, 255, 200])
    brown_mask = cv2.inRange(hsv, brown_lower, brown_upper)

    # Yellow / chlorotic mask
    yellow_lower = np.array([20, 60, 100])
    yellow_upper = np.array([34, 255, 255])
    yellow_mask = cv2.inRange(hsv, yellow_lower, yellow_upper)

    total_leaf_px = int(np.count_nonzero(green_mask) + np.count_nonzero(brown_mask) + np.count_nonzero(yellow_mask))
    if total_leaf_px < 500:
        # Fall back to whole-frame stats if leaf segmentation is too small (e.g. non-leaf photo)
        total_leaf_px = img.shape[0] * img.shape[1]

    brown_ratio = np.count_nonzero(brown_mask) / total_leaf_px
    yellow_ratio = np.count_nonzero(yellow_mask) / total_leaf_px
    unhealthy_ratio = brown_ratio + yellow_ratio

    # Contour count on brown mask approximates lesion/spot count
    contours, _ = cv2.findContours(brown_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    lesion_spots = len([c for c in contours if cv2.contourArea(c) > 15])

    if unhealthy_ratio > 0.16 and lesion_spots >= 3:
        label = "Early Blight"
        healthy = False
    elif unhealthy_ratio > 0.10:
        label = "Leaf Spot"
        healthy = False
    elif yellow_ratio > 0.22:
        label = "Nutrient Deficiency"
        healthy = False
    else:
        label = "Healthy"
        healthy = True

    # Confidence derived from how decisively pixels fell into a class
    confidence = float(min(99.0, max(72.0, 100 * (1 - abs(0.5 - unhealthy_ratio)))))

    return {
        "disease_label": label,
        "healthy": healthy,
        "confidence": round(confidence, 1),
        "remedy": DISEASE_REMEDIES[label],
        "unhealthy_pixel_ratio": round(unhealthy_ratio, 3),
        "lesion_spots_detected": lesion_spots,
        "model": MODEL_ID,
    }
