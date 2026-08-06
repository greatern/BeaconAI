import enum

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
    Enum as SAEnum,
)
from sqlalchemy.sql import func

from app.db.database import Base


class NotificationReason(str, enum.Enum):
    NEAR_HOME = "near_home"
    NEAR_WORK = "near_work"


class Notification(Base):

    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    report_id = Column(Integer, ForeignKey("reports.id", ondelete="CASCADE"), nullable=False, index=True)

    reason = Column(
        SAEnum(NotificationReason, values_callable=lambda e: [m.value for m in e], name="notificationreason"),
        nullable=False,
    )

    # Straight-line distance from the matched location (home or work) to
    # the report, at the moment this notification was created.
    distance_meters = Column(Integer, nullable=False)

    # Rendered once at creation time (e.g. "New pothole report 320m from
    # your home") rather than reconstructed from the report at read time
    # - keeps the read path a single-table query, and the message stays
    # accurate even if the report is edited or deleted later.
    message = Column(Text, nullable=False)

    is_read = Column(Boolean, nullable=False, default=False, server_default="false")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
