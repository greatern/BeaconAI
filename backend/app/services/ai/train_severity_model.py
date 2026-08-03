"""
Trains a severity-scoring model for incident reports.

Beacon AI doesn't have real, verified severity labels yet — there's no
historical data to learn from on a brand-new product. Rather than skip
severity scoring, this trains a real scikit-learn model on a
*heuristic-labeled* synthetic dataset: a rule-based function assigns a
"weak label" severity score to synthetic report descriptions, and a
RandomForestRegressor learns to generalize from that signal. This is a
standard cold-start technique known as weak/distant supervision.

Once Beacon AI has real, verified severity labels (e.g. from moderator
review or user feedback on resolved reports), point `_generate_synthetic
_dataset` at that real data instead — the training/inference interface
below doesn't need to change.

Run standalone to retrain and see evaluation metrics:
    python -m app.services.ai.train_severity_model
"""

import random
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

from app.models.report import IncidentCategory

ARTIFACT_PATH = Path(__file__).resolve().parent / "artifacts" / "severity_model.joblib"

# Base severity per category (0-100) — reflects typical real-world risk/urgency.
BASE_SEVERITY = {
    IncidentCategory.FIRE.value: 85,
    IncidentCategory.CRIME.value: 78,
    IncidentCategory.ROAD_ACCIDENT.value: 75,
    IncidentCategory.FLOODING.value: 68,
    IncidentCategory.POWER_OUTAGE.value: 52,
    IncidentCategory.BROKEN_TRAFFIC_LIGHT.value: 45,
    IncidentCategory.WATER_LEAK.value: 42,
    IncidentCategory.FALLEN_TREE.value: 38,
    IncidentCategory.OTHER.value: 30,
    IncidentCategory.ILLEGAL_DUMPING.value: 28,
    IncidentCategory.POTHOLE.value: 25,
}

# Keyword -> severity delta, applied if present in the description (case-insensitive).
SEVERITY_KEYWORDS = {
    "injur": 22, "hurt": 18, "bleeding": 25, "trapped": 25, "unconscious": 30,
    "child": 15, "school": 12, "elderly": 12, "hospital": 15,
    "spreading": 15, "collapsed": 18, "blocked": 10, "emergency": 15,
    "urgent": 12, "immediately": 10, "dangerous": 12, "risk": 8,
    "multiple": 8, "several": 6, "large": 8, "major": 10,
    "minor": -15, "small": -10, "slight": -10, "slowly": -6,
    "already": -5, "resolved": -20, "fixed": -18,
}

DESCRIPTION_TEMPLATES = [
    "There is a {category} near {place}.",
    "Reporting a {category} on {place}, please assist.",
    "{category} spotted at {place}, {detail}.",
    "Urgent: {category} at {place}, {detail}.",
    "Minor {category} noticed near {place}.",
    "A {category} has been {detail} at {place}.",
    "{category} on {place} - {detail}.",
]

PLACES = [
    "Main Road", "the school", "the intersection", "the residential area",
    "the highway", "the shopping center", "the park", "the bridge",
    "the industrial area", "the taxi rank",
]

DETAILS = [
    "no injuries reported", "several people affected", "children nearby",
    "already resolved", "spreading quickly", "blocking traffic",
    "minor and contained", "multiple vehicles involved", "elderly resident affected",
    "just noticed, slowly worsening", "an emergency situation", "under control",
]

CATEGORY_WORDS = {
    IncidentCategory.POTHOLE.value: "pothole",
    IncidentCategory.WATER_LEAK.value: "water leak",
    IncidentCategory.FLOODING.value: "flooding",
    IncidentCategory.FIRE.value: "fire",
    IncidentCategory.ILLEGAL_DUMPING.value: "illegal dumping",
    IncidentCategory.BROKEN_TRAFFIC_LIGHT.value: "broken traffic light",
    IncidentCategory.FALLEN_TREE.value: "fallen tree",
    IncidentCategory.POWER_OUTAGE.value: "power outage",
    IncidentCategory.CRIME.value: "crime",
    IncidentCategory.ROAD_ACCIDENT.value: "road accident",
    IncidentCategory.OTHER.value: "incident",
}


def _weak_label(category: str, description: str) -> float:
    """Rule-based 'ground truth' used only to bootstrap training data."""
    score = BASE_SEVERITY[category]

    lowered = description.lower()
    for keyword, delta in SEVERITY_KEYWORDS.items():
        if keyword in lowered:
            score += delta

    score += random.gauss(0, 6)  # natural variance
    return float(np.clip(score, 1, 100))


def _generate_synthetic_dataset(n_per_category: int = 220):
    rows = []
    for category, word in CATEGORY_WORDS.items():
        for _ in range(n_per_category):
            template = random.choice(DESCRIPTION_TEMPLATES)
            description = template.format(
                category=word,
                place=random.choice(PLACES),
                detail=random.choice(DETAILS),
            )
            severity = _weak_label(category, description)
            rows.append({"category": category, "description": description, "severity": severity})

    random.shuffle(rows)
    return rows


def train_and_save() -> dict:
    rows = _generate_synthetic_dataset()

    X = pd.DataFrame([{"category": r["category"], "description": r["description"]} for r in rows])
    y = np.array([r["severity"] for r in rows])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    preprocessor = ColumnTransformer(
        transformers=[
            ("category", OneHotEncoder(handle_unknown="ignore"), ["category"]),
            ("description", TfidfVectorizer(max_features=300, ngram_range=(1, 2)), "description"),
        ]
    )

    model = Pipeline(
        steps=[
            ("preprocess", preprocessor),
            ("regressor", RandomForestRegressor(n_estimators=200, max_depth=12, random_state=42)),
        ]
    )

    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    metrics = {
        "mae": float(mean_absolute_error(y_test, preds)),
        "r2": float(r2_score(y_test, preds)),
        "n_train": len(X_train),
        "n_test": len(X_test),
    }

    ARTIFACT_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, ARTIFACT_PATH)

    return metrics


if __name__ == "__main__":
    result = train_and_save()
    print(f"Trained severity model on {result['n_train']} examples, tested on {result['n_test']}.")
    print(f"MAE: {result['mae']:.2f}  |  R2: {result['r2']:.3f}")
    print(f"Saved to {ARTIFACT_PATH}")
