from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.notification import Notification
from app.schemas.notification import NotificationResponse, NotificationListResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("", response_model=NotificationListResponse)
def list_notifications(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Notification).filter(Notification.user_id == current_user.id)

    total = query.count()
    unread_count = query.filter(Notification.is_read.is_(False)).count()

    notifications = (
        query.order_by(Notification.created_at.desc())
        .offset(offset)
        .limit(min(limit, 100))
        .all()
    )

    return NotificationListResponse(
        total=total,
        unread_count=unread_count,
        notifications=notifications,
    )


@router.post("/{notification_id}/read", response_model=NotificationResponse)
def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notification = (
        db.query(Notification)
        .filter(Notification.id == notification_id, Notification.user_id == current_user.id)
        .first()
    )

    if notification is None:
        raise HTTPException(404, "Notification not found")

    notification.is_read = True
    db.commit()
    db.refresh(notification)

    return notification


@router.post("/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id, Notification.is_read.is_(False))
        .update({"is_read": True})
    )
    db.commit()

    return {"message": "All notifications marked as read"}
