"""
AgriSphere AI — Post-Harvest Intelligence Subsystem 1: Image Preprocessor
Grain sample image validation, EXIF stripping, and resizing.
"""
import io
from PIL import Image

MAX_FILE_SIZE_MB = 10
ALLOWED_FORMATS = {"JPEG", "JPG", "PNG", "WEBP"}
TARGET_SIZE = (640, 640)


def preprocess_grain_image(image_bytes: bytes) -> tuple[bytes, dict]:
    """Validates grain sample photo, resizes, and returns (processed_bytes, metadata)."""
    if len(image_bytes) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise ValueError(f"Image size exceeds maximum limit of {MAX_FILE_SIZE_MB}MB")

    try:
        img = Image.open(io.BytesIO(image_bytes))
    except Exception as e:
        raise ValueError(f"Invalid or corrupt grain image: {str(e)}")

    if img.format and img.format.upper() not in ALLOWED_FORMATS:
        raise ValueError(f"Unsupported format '{img.format}'. Allowed: {', '.join(ALLOWED_FORMATS)}")

    orig_width, orig_height = img.size
    img_rgb = img.convert("RGB")
    img_resized = img_rgb.resize(TARGET_SIZE, Image.Resampling.LANCZOS)

    buffer = io.BytesIO()
    img_resized.save(buffer, format="JPEG", quality=85)
    processed_bytes = buffer.getvalue()

    return processed_bytes, {
        "original_width": orig_width,
        "original_height": orig_height,
        "processed_width": TARGET_SIZE[0],
        "processed_height": TARGET_SIZE[1],
        "format": "JPEG",
        "size_bytes": len(processed_bytes),
    }
