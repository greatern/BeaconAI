"""
Creates in-app notifications for users whose home or work location is
near a newly created report.

Simple, transparent heuristic, same philosophy as duplicate detection
and the Community Health Index: if a user's home or work coordinates
are set and within NOTIFY_RADIUS_METERS of the report, they get one
notification for it. If both home and work match, home wins (a report
near where someone sleeps is treated as the more important alert).

No per-user radius or category preferences yet - everyone within
range gets notified regardless of category. That's the natural next
knob to add (the User model already has home_lat/home_lng/work_lat/
work_lng; it doesn't yet have a radius override or a preferred-
categories list).

Runs inside the same Celery task as AI enrichment and duplicate
detection, right after those - and only for reports NOT flagged as a
duplicate, since notifying nearby users about the same incident twice
isn't useful.
"""

from typing import Optional, Tuple

from sqlalchemy.orm import Session

from app.models.notification import Notification, NotificationReason
from app.models.report import Report
from app.models.user import User
from app.services.geo import haversine_meters

NOTIFY_RADIUS_METERS = 2000


def _category_label(report: Report) -> str:
    return report.category.value.replace("_", " ")


def create_notifications_for_report(db: Session, report: Report) -> int:
    """
    Creates one Notification per nearby user (excluding the reporter
    themselves). Returns the number created.
    """

    candidates = (
        db.query(User)
        .filter(User.id != report.user_id)
        .filter(
            (User.home_lat.isnot(None) & User.home_lng.isnot(None))
            | (User.work_lat.isnot(None) & User.work_lng.isnot(None))
        )
        .all()
    )

    created = 0

    for user in candidates:
        match: Optional[Tuple[NotificationReason, float]] = None

        if user.home_lat is not None and user.home_lng is not None:
            distance = haversine_meters(report.latitude, report.longitude, user.home_lat, user.home_lng)
            if distance <= NOTIFY_RADIUS_METERS:
                match = (NotificationReason.NEAR_HOME, distance)

        if match is None and user.work_lat is not None and user.work_lng is not None:
            distance = haversine_meters(report.latitude, report.longitude, user.work_lat, user.work_lng)
            if distance <= NOTIFY_RADIUS_METERS:
                match = (NotificationReason.NEAR_WORK, distance)

        if match is None:
            continue

        reason, distance = match
        location_label = "home" if reason is NotificationReason.NEAR_HOME else "work"

        db.add(
            Notification(
                user_id=user.id,
                report_id=report.id,
                reason=reason,
                distance_meters=round(distance),
                message=f"New {_category_label(report)} report {round(distance)}m from your {location_label}",
            )
        )
        created += 1

    if created:
        db.commit()

    return created
