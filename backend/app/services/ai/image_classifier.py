"""
Zero-shot image classification for incident report photos.

Uses CLIP (via a Hugging Face pipeline) to compare the uploaded photo
against natural-language prompts for each incident category, rather than
a model fine-tuned on a labeled pothole/fire/etc. dataset (which Beacon
AI doesn't have yet). This is a genuine, well-established zero-shot
technique: CLIP embeds the image and each candidate caption into the
same vector space and returns the caption with the highest cosine
similarity to the image.

The first call downloads the model weights (~600MB) from Hugging Face
and caches them locally (~/.cache/huggingface by default) - this needs
internet access once; every call after that runs fully offline.
"""

import os
from functools import lru_cache
from typing import Optional

from app.models.report import IncidentCategory

# Fail fast if the model can't be reached, instead of hanging for the
# default multi-minute retry/backoff window - this runs inline with a
# report submission, so a slow failure here means a slow API response.
os.environ.setdefault("HF_HUB_DOWNLOAD_TIMEOUT", "8")

MODEL_NAME = "openai/clip-vit-base-patch32"

_CATEGORY_PROMPTS = {
    IncidentCategory.POTHOLE: "a photo of a pothole in a road",
    IncidentCategory.WATER_LEAK: "a photo of a water leak or burst pipe",
    IncidentCategory.FLOODING: "a photo of flooding or a flooded street",
    IncidentCategory.FIRE: "a photo of a fire or smoke",
    IncidentCategory.ILLEGAL_DUMPING: "a photo of illegally dumped rubbish or waste",
    IncidentCategory.BROKEN_TRAFFIC_LIGHT: "a photo of a broken or non-working traffic light",
    IncidentCategory.FALLEN_TREE: "a photo of a fallen tree blocking a road or path",
    IncidentCategory.POWER_OUTAGE: "a photo related to a power outage or a downed power line",
    IncidentCategory.CRIME: "a photo of a crime scene",
    IncidentCategory.ROAD_ACCIDENT: "a photo of a road accident or car crash",
    IncidentCategory.OTHER: "a photo of a general community incident",
}

_PROMPT_TO_CATEGORY = {v: k for k, v in _CATEGORY_PROMPTS.items()}


_unavailable = False


@lru_cache(maxsize=1)
def _get_classifier():
    from transformers import pipeline

    return pipeline("zero-shot-image-classification", model=MODEL_NAME)


def classify_image(image_path: str) -> Optional[tuple[IncidentCategory, float]]:
    """
    Returns (predicted_category, confidence) for the image at image_path,
    or None if classification isn't available (e.g. model failed to load
    or the image couldn't be read). Never raises - image classification
    is a nice-to-have enhancement, not something that should block a
    report submission if it fails.

    If the model fails to load once (e.g. Hugging Face is unreachable),
    every later call in this process short-circuits to None immediately
    rather than repeating a slow retry-and-timeout on every report.
    Restart the server to try again once connectivity is fixed.
    """
    global _unavailable

    if _unavailable:
        return None

    try:
        classifier = _get_classifier()
        results = classifier(image_path, candidate_labels=list(_CATEGORY_PROMPTS.values()))
    except Exception:
        _unavailable = True
        return None

    top = results[0]
    category = _PROMPT_TO_CATEGORY[top["label"]]
    confidence = round(float(top["score"]), 3)

    return category, confidence
