"""
Flags a newly enriched report as a likely duplicate of an existing
one nearby.

Same philosophy as the Community Health Index (see reports/utils.ts
on the frontend): a small, transparent, rule-based heuristic instead
of an embeddings/vector-similarity model. Easy to explain to a
moderator ("flagged because it's the same category, 80m away, and
2 hours after an existing open report") and easy to tune two
constants instead of retraining anything.

A report is considered a likely duplicate of another when ALL of:
  - same category (as the user selected it - not the AI-detected one,
    since that's a lower-confidence signal)
  - within DUPLICATE_RADIUS_METERS of each other, straight-line
    (haversine) distance
  - the existing report was created within the last
    DUPLICATE_WINDOW_HOURS
  - the existing report isn't already resolved or rejected (no value
    flagging a duplicate of something already closed out)
  - the existing report isn't itself already flagged as a duplicate
    (so duplicates always point back at one "original", not a chain)

When multiple candidates match, the closest one wins.

Known limitation: this scans every same-category report from the
last DUPLICATE_WINDOW_HOURS and computes distance to each in Python.
Fine at the report volumes this project deals with; if that ever
becomes a real query, the natural fix is a bounding-box filter in SQL
before the haversine pass, or a move to PostGIS (see project roadmap)
for real spatial indexing.
"""

import math
from datetime import datetime, timedelta, timezone
from typing import Optional

from sqlalchemy.orm import Session

from app.models.report import Report, ReportStatus

DUPLICATE_RADIUS_METERS = 150
DUPLICATE_WINDOW_HOURS = 72

_EARTH_RADIUS_METERS = 6_371_000


def _haversine_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(d_phi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    )

    return 2 * _EARTH_RADIUS_METERS * math.asin(math.sqrt(a))


def find_duplicate(db: Session, report: Report) -> Optional[Report]:
    """
    Returns the closest matching existing report if `report` looks
    like a duplicate of it, otherwise None. Never returns `report`
    itself.
    """

    cutoff = datetime.now(timezone.utc) - timedelta(hours=DUPLICATE_WINDOW_HOURS)

    candidates = (
        db.query(Report)
        .filter(Report.id != report.id)
        .filter(Report.category == report.category)
        .filter(Report.created_at >= cutoff)
        .filter(Report.status.notin_([ReportStatus.RESOLVED, ReportStatus.REJECTED]))
        .filter(Report.duplicate_of_id.is_(None))
        .all()
    )

    best: Optional[Report] = None
    best_distance = DUPLICATE_RADIUS_METERS

    for candidate in candidates:
        distance = _haversine_meters(
            report.latitude, report.longitude, candidate.latitude, candidate.longitude
        )

        if distance <= best_distance:
            best = candidate
            best_distance = distance

    return best
