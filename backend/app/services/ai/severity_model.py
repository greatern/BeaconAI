"""
Inference wrapper around the trained severity model.

Loads the joblib artifact once (module-level singleton) and exposes a
single `predict_severity` function. If no trained artifact exists yet
(e.g. first run on a fresh clone), it trains one automatically — training
takes well under a second since the synthetic dataset is small.
"""

from app.services.ai.train_severity_model import ARTIFACT_PATH, train_and_save

_model = None


def _get_model():
    global _model

    if _model is not None:
        return _model

    if not ARTIFACT_PATH.exists():
        train_and_save()

    import joblib

    _model = joblib.load(ARTIFACT_PATH)
    return _model


def predict_severity(category: str, description: str | None) -> float:
    """Returns a severity score from 0-100 for the given report."""

    import pandas as pd

    model = _get_model()

    row = pd.DataFrame([{"category": category, "description": description or ""}])

    score = model.predict(row)[0]

    return round(float(max(0.0, min(100.0, score))), 1)
