from typing import Optional

from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.report import Report, IncidentCategory, ReportStatus
from app.schemas.report import ReportResponse, ReportListResponse
from app.services.storage import save_report_image, resolve_image_path
from app.services.ai.pipeline import run_ai_pipeline

router = APIRouter(prefix="/reports", tags=["Reports"])


def _to_response(report: Report) -> ReportResponse:
    return ReportResponse(
        id=report.id,
        user_id=report.user_id,
        category=report.category,
        description=report.description,
        image_url=f"/{report.image_path}" if report.image_path else None,
        latitude=report.latitude,
        longitude=report.longitude,
        address=report.address,
        status=report.status,
        ai_summary=report.ai_summary,
        severity_score=report.severity_score,
        ai_category=report.ai_category,
        ai_confidence=report.ai_confidence,
        created_at=report.created_at,
    )


@router.post("", response_model=ReportResponse, status_code=201)
async def create_report(
    category: IncidentCategory = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    description: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    image_path = await save_report_image(image) if image is not None else None

    report = Report(
        user_id=current_user.id,
        category=category,
        description=description,
        address=address,
        latitude=latitude,
        longitude=longitude,
        image_path=image_path,
        status=ReportStatus.PENDING,
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    # AI enrichment runs inline for now (see pipeline.py docstring for why,
    # and the natural upgrade path to a background task queue). Each step
    # inside is independently fault-tolerant, so a report is never lost or
    # left half-created if a model fails to load.
    result = run_ai_pipeline(
        category=category,
        description=description,
        address=address,
        image_path=resolve_image_path(image_path) if image_path else None,
    )

    report.severity_score = result.severity_score
    report.ai_summary = result.ai_summary
    report.ai_category = result.ai_category
    report.ai_confidence = result.ai_confidence

    db.commit()
    db.refresh(report)

    return _to_response(report)


@router.get("", response_model=ReportListResponse)
def list_reports(
    category: Optional[IncidentCategory] = None,
    status: Optional[ReportStatus] = None,
    user_id: Optional[int] = None,
    min_lat: Optional[float] = None,
    max_lat: Optional[float] = None,
    min_lng: Optional[float] = None,
    max_lng: Optional[float] = None,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    """
    Public feed for the live map. Supports an optional bounding box
    (min_lat/max_lat/min_lng/max_lng) so the frontend only fetches
    reports within the current viewport instead of the whole table,
    and an optional user_id filter for a "my reports" view.
    """

    query = db.query(Report)

    if category is not None:
        query = query.filter(Report.category == category)

    if status is not None:
        query = query.filter(Report.status == status)

    if user_id is not None:
        query = query.filter(Report.user_id == user_id)

    if min_lat is not None:
        query = query.filter(Report.latitude >= min_lat)

    if max_lat is not None:
        query = query.filter(Report.latitude <= max_lat)

    if min_lng is not None:
        query = query.filter(Report.longitude >= min_lng)

    if max_lng is not None:
        query = query.filter(Report.longitude <= max_lng)

    total = query.count()

    reports = (
        query.order_by(Report.created_at.desc())
        .offset(offset)
        .limit(min(limit, 500))
        .all()
    )

    return ReportListResponse(
        total=total,
        reports=[_to_response(r) for r in reports],
    )


@router.get("/{report_id}", response_model=ReportResponse)
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()

    if report is None:
        raise HTTPException(404, "Report not found")

    return _to_response(report)
