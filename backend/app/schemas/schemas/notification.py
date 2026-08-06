from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.notification import NotificationReason


class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    report_id: int
    reason: NotificationReason
    distance_meters: int
    message: str
    is_read: bool
    created_at: datetime


class NotificationListResponse(BaseModel):
    total: int
    unread_count: int
    notifications: list[NotificationResponse]
