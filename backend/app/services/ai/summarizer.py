"""
Generates a short, readable AI summary for an incident report.

Uses a small local sequence-to-sequence model (Flan-T5-small, ~300MB)
via Hugging Face Transformers to turn the structured report fields
(category, user description, address, severity) into a single
natural-language sentence - the kind of thing a human moderator might
write when triaging reports.

Flan-T5-small was chosen deliberately over a larger LLM: it's small
enough to run comfortably on a CPU-only laptop with no GPU, which
matters since this runs synchronously inline with report creation for
now (see app/services/ai/pipeline.py). If summary quality needs to
improve later, swapping in a bigger local model or a hosted LLM API is
a drop-in change - callers only see `generate_summary(...)`.

The first call downloads the model weights from Hugging Face and caches
them locally - this needs internet access once, then runs fully offline.
"""

import os
from functools import lru_cache
from typing import Optional

from app.models.report import IncidentCategory

os.environ.setdefault("HF_HUB_DOWNLOAD_TIMEOUT", "8")

MODEL_NAME = "google/flan-t5-small"

_CATEGORY_LABELS = {
    IncidentCategory.POTHOLE: "pothole",
    IncidentCategory.WATER_LEAK: "water leak",
    IncidentCategory.FLOODING: "flooding",
    IncidentCategory.FIRE: "fire",
    IncidentCategory.ILLEGAL_DUMPING: "illegal dumping",
    IncidentCategory.BROKEN_TRAFFIC_LIGHT: "broken traffic light",
    IncidentCategory.FALLEN_TREE: "fallen tree",
    IncidentCategory.POWER_OUTAGE: "power outage",
    IncidentCategory.CRIME: "crime",
    IncidentCategory.ROAD_ACCIDENT: "road accident",
    IncidentCategory.OTHER: "incident",
}


_unavailable = False


@lru_cache(maxsize=1)
def _get_generator():
    from transformers import pipeline

    return pipeline("text2text-generation", model=MODEL_NAME)


def generate_summary(
    category: IncidentCategory,
    description: Optional[str],
    address: Optional[str],
    severity: float,
) -> Optional[str]:
    """
    Returns a one-sentence AI summary, or None if generation isn't
    available. Never raises - this enriches a report but should never
    block a submission if the model fails to load or run.

    If the model fails to load once (e.g. Hugging Face is unreachable),
    every later call in this process short-circuits to None immediately
    rather than repeating a slow retry-and-timeout on every report.
    Restart the server to try again once connectivity is fixed.
    """
    global _unavailable

    if _unavailable:
        return None

    category_label = _CATEGORY_LABELS.get(category, "incident")
    urgency = "low" if severity < 35 else "moderate" if severity < 65 else "high"

    prompt = (
        f"Write one short, plain-English sentence summarizing this community incident report "
        f"for a public safety dashboard. Category: {category_label}. "
        f"Location: {address or 'not specified'}. "
        f"Urgency: {urgency}. "
        f"Reporter's description: {description or 'no additional details provided'}."
    )

    try:
        generator = _get_generator()
        result = generator(prompt, max_new_tokens=60, do_sample=False)
    except Exception:
        _unavailable = True
        return None

    text = result[0]["generated_text"].strip()

    return text or None
