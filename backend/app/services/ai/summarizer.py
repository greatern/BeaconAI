"""
Generates a short, readable AI summary for an incident report.

Uses Google's Flan-T5 model locally (CPU friendly) to produce a concise
one-sentence summary. The model is loaded only once and cached for the
lifetime of the process.

If the model cannot be loaded (network issue on first download, missing
weights, etc.), the function simply returns None so that report creation
continues without AI summarisation.
"""

import os
from functools import lru_cache
from typing import Optional

from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

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
def _load_model():
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)
    return tokenizer, model


def generate_summary(
    category: IncidentCategory,
    description: Optional[str],
    address: Optional[str],
    severity: float,
) -> Optional[str]:
    """
    Generate a one-sentence summary for a report.

    Returns None if the model cannot be loaded or generation fails.
    """
    global _unavailable

    if _unavailable:
        return None

    category_label = _CATEGORY_LABELS.get(category, "incident")
    urgency = (
        "low"
        if severity < 35
        else "moderate"
        if severity < 65
        else "high"
    )

    prompt = f"""
Summarize the following community incident in ONE short sentence.

Category: {category_label}
Location: {address or "Unknown"}
Urgency: {urgency}
Description: {description or "No additional details"}

Summary:
"""

    try:
        tokenizer, model = _load_model()

        inputs = tokenizer(
            prompt,
            return_tensors="pt",
            truncation=True,
            max_length=512,
        )

        outputs = model.generate(
            **inputs,
            max_new_tokens=40,
            do_sample=False,
            num_beams=4,
            early_stopping=True,
        )

        summary = tokenizer.decode(
            outputs[0],
            skip_special_tokens=True,
        ).strip()

        print("=" * 80)
        print("AI SUMMARY")
        print(summary)
        print("=" * 80)

        return summary or None

    except Exception as e:
        print("Summary generation failed:", e)
        _unavailable = True
        return None