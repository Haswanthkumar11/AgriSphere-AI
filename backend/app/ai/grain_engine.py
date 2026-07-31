"""
AgriSphere AI — Grain Quality Engine (Module 3 core AI capability)
====================================================================
Real OpenCV contour-detection grain sizing pipeline:
  1. Grayscale + Otsu threshold to separate grains from background.
  2. Find contours -> treat each as one grain.
  3. Measure each grain's bounding-ellipse length (px) -> convert to mm
     using an assumed reference scale (a production system calibrates
     this with a fixed-size marker in frame).
  4. Foreign matter = non-grain-colored specks; moisture damage
     approximated from dark/discolored grain proportion.

Same isolation principle as disease_engine.py: `quality_service.py` only
ever calls `analyze()`. Swapping this for a trained YOLO grain-segmentation
model + LightGBM price regressor later means editing this file only.
"""
import cv2
import numpy as np

from .image_io import read_image


def analyze(file_bytes: bytes, base_market_price: float = 2150.0) -> dict:
    img = read_image(file_bytes)
    img = cv2.resize(img, (640, 640))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    kernel = np.ones((3, 3), np.uint8)
    clean = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=1)

    contours, _ = cv2.findContours(clean, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    grains = [c for c in contours if cv2.contourArea(c) > 25]

    if not grains:
        # No distinct grains segmented (e.g. blurry/whole-sack photo) — return
        # a conservative mid-range estimate rather than a fabricated precise one.
        return {
            "crop": "Paddy Grain",
            "quality_score": 78.0,
            "avg_grain_length_mm": 6.4,
            "moisture_damage_percent": 4.5,
            "foreign_matter_percent": 3.0,
            "grain_count": 0,
            "recommended_price": round(base_market_price * 0.97, 2),
            "note": "Low grain segmentation confidence — retake photo with grains spread flat under good light.",
        }

    # Reference scale: assume frame width ≈ 90mm of sample tray (calibration
    # constant — replace with a fiducial marker measurement in production).
    px_per_mm = 640 / 90.0

    lengths_mm = []
    dark_grain_count = 0
    for c in grains:
        (_, _), (w, h), _ = cv2.minAreaRect(c)
        length_px = max(w, h)
        lengths_mm.append(length_px / px_per_mm)

        mask = np.zeros(gray.shape, np.uint8)
        cv2.drawContours(mask, [c], -1, 255, -1)
        mean_val = cv2.mean(gray, mask=mask)[0]
        if mean_val < 90:
            dark_grain_count += 1

    avg_length = float(np.clip(np.mean(lengths_mm), 4.5, 9.5))
    grain_count = len(grains)
    moisture_damage_percent = round(100 * dark_grain_count / grain_count, 1)

    # Foreign matter estimated from very small fragment contours relative to median grain size
    median_area = float(np.median([cv2.contourArea(c) for c in grains]))
    fragments = [c for c in grains if cv2.contourArea(c) < median_area * 0.25]
    foreign_matter_percent = round(100 * len(fragments) / grain_count, 1)

    purity = max(60.0, 100 - moisture_damage_percent * 1.3 - foreign_matter_percent * 1.1)
    quality_score = round(min(99.0, purity), 1)

    price_multiplier = 0.90 + (quality_score / 100) * 0.20
    recommended_price = round(base_market_price * price_multiplier, 2)

    return {
        "crop": "Paddy Grain",
        "quality_score": quality_score,
        "avg_grain_length_mm": round(avg_length, 1),
        "moisture_damage_percent": moisture_damage_percent,
        "foreign_matter_percent": foreign_matter_percent,
        "grain_count": grain_count,
        "recommended_price": recommended_price,
    }
