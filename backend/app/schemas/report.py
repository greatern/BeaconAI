from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.report import IncidentCategory, ReportStatus


class ReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    category: IncidentCategory
    description: Optional[str] = None
    image_url: Optional[str] = None
    latitude: float
    longitude: float
    address: Optional[str] = None
    status: ReportStatus
    ai_summary: Optional[str] = None
    severity_score: Optional[float] = None
    ai_category: Optional[IncidentCategory] = None
    ai_confidence: Optional[float] = None
    is_duplicate: bool = False
    duplicate_of_id: Optional[int] = None
    created_at: datetime


class ReportListResponse(BaseModel):
    total: int
    reports: list[ReportResponse]
