"""
Image storage for citizen report uploads.

Local disk for now (dev-friendly, zero infra). Kept behind a small
function boundary so swapping to S3 later only means changing this
file, not every route that calls it.
"""

import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status

from app.core.config import settings

BASE_DIR = Path(__file__).resolve().parent.parent.parent  # backend/
UPLOAD_ROOT = BASE_DIR / settings.UPLOAD_DIR

UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)

_EXT_BY_CONTENT_TYPE = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}


async def save_report_image(file: UploadFile) -> str:
    """
    Validate and persist an uploaded report image to local disk.

    Returns the relative path (e.g. "uploads/reports/<uuid>.jpg") to
    store on the Report row. Raises HTTPException on invalid input.
    """

    if file.content_type not in settings.ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported image type: {file.content_type}",
        )

    contents = await file.read()

    max_bytes = settings.MAX_UPLOAD_MB * 1024 * 1024

    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image exceeds {settings.MAX_UPLOAD_MB}MB limit",
        )

    ext = _EXT_BY_CONTENT_TYPE[file.content_type]
    filename = f"{uuid.uuid4().hex}{ext}"

    destination = UPLOAD_ROOT / filename
    destination.write_bytes(contents)

    return f"{settings.UPLOAD_DIR}/{filename}"
