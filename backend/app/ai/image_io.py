"""
Shared image decoding for AI engines. Kept separate so every engine
(disease, grain, and future ones) reads uploaded bytes the same way.
"""
import cv2
import numpy as np
from PIL import Image
import io


def read_image(file_bytes: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    arr = np.array(img)
    return cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)
