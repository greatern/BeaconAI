"""
Orchestrates the AI enrichment pipeline for a newly created report.

Runs three independent steps and combines their results:
  1. Severity scoring (scikit-learn, always available - trained locally,
     no external dependency).
  2. Image classification (CLIP zero-shot, only if an image was
     uploaded).
  3. AI summary generation (Flan-T5-small).

Each step is independently fault-tolerant - if image classification or
summary generation can't reach Hugging Face, the pipeline still returns
a real, locally-computed severity score rather than failing the whole
report submission. See image_classifier.py and summarizer.py for their
individual fallback behavior.

This runs synchronously, inline with POST /reports, for simplicity.
Once report volume grows, this is the natural place to hand off to a
background task queue (Celery + Redis, already on the project roadmap)
instead of blocking the request.
"""

from dataclasses import dataclass
from typing import Optional

from app.models.report import IncidentCategory
from app.services.ai.image_classifier import classify_image
from app.services.ai.severity_model import predict_severity
from app.services.ai.summarizer import generate_summary


@dataclass
class AIPipelineResult:
    severity_score: float
    ai_summary: Optional[str]
    ai_category: Optional[IncidentCategory]
    ai_confidence: Optional[float]


def run_ai_pipeline(
    category: IncidentCategory,
    description: Optional[str],
    address: Optional[str],
    image_path: Optional[str],
) -> AIPipelineResult:

    severity_score = predict_severity(category.value, description)

    ai_category: Optional[IncidentCategory] = None
    ai_confidence: Optional[float] = None

    if image_path:
        classification = classify_image(image_path)
        if classification is not None:
            ai_category, ai_confidence = classification

    ai_summary = generate_summary(category, description, address, severity_score)

    return AIPipelineResult(
        severity_score=severity_score,
        ai_summary=ai_summary,
        ai_category=ai_category,
        ai_confidence=ai_confidence,
    )
