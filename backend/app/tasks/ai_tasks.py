"""
Background task: runs AI enrichment, duplicate detection, and nearby-
user notifications for a report outside the request thread.

Important - this module is imported by a *separate* process (the
Celery worker), not by FastAPI. `Report.user = relationship("User",
...)` uses a string reference to "User" that SQLAlchemy only resolves
once the User class has actually been imported somewhere in the
current process's registry. FastAPI gets this for free because other
modules it loads happen to import User along the way; a standalone
worker process does not get that for free, and the very first task
crashes with a SQLAlchemy mapper-resolution error the moment it
touches `report.user` (or anything that initializes the mapper, which
can include unrelated queries once the registry is configured).

The fix is the explicit, otherwise-unused import below. Do not remove
it even though nothing in this file appears to reference `User`
directly - it exists purely for its import side effect.
"""

from app.core.celery_app import celery_app
from app.db.database import SessionLocal
from app.models.report import Report
from app.models.user import User  # noqa: F401 - see module docstring, required for mapper resolution
from app.services.ai.duplicate_detector import find_duplicate
from app.services.ai.pipeline import run_ai_pipeline
from app.services.notifications import create_notifications_for_report
from app.services.storage import resolve_image_path


@celery_app.task(name="app.tasks.ai_tasks.enrich_report")
def enrich_report(report_id: int) -> None:
    """
    Fetches the report, runs the full AI pipeline, and writes the
    results back. Opens and closes its own DB session since this runs
    in the worker process, entirely separate from any FastAPI request
    session.
    """

    db = SessionLocal()

    try:
        report = db.query(Report).filter(Report.id == report_id).first()

        if report is None:
            # Report was deleted between enqueue and task pickup - nothing to do.
            return

        result = run_ai_pipeline(
            category=report.category,
            description=report.description,
            address=report.address,
            image_path=resolve_image_path(report.image_path) if report.image_path else None,
        )

        report.severity_score = result.severity_score
        report.ai_summary = result.ai_summary
        report.ai_category = result.ai_category
        report.ai_confidence = result.ai_confidence

        # Duplicate check runs alongside AI enrichment (same background
        # task, same DB session) rather than inline at submission time -
        # by the time this task runs, the report has a stable id and
        # timestamp to compare against other reports with.
        duplicate = find_duplicate(db, report)

        if duplicate is not None:
            report.is_duplicate = True
            report.duplicate_of_id = duplicate.id

        db.commit()

        # Notify nearby users only for genuinely new incidents - skip
        # this for anything just flagged as a duplicate, since alerting
        # people about the same pothole a second time isn't useful.
        if not report.is_duplicate:
            create_notifications_for_report(db, report)

    finally:
        db.close()
