import enum

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
    Enum as SAEnum,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


def _enum_values(enum_cls):
    return [member.value for member in enum_cls]


class IncidentCategory(str, enum.Enum):
    POTHOLE = "pothole"
    WATER_LEAK = "water_leak"
    FLOODING = "flooding"
    FIRE = "fire"
    ILLEGAL_DUMPING = "illegal_dumping"
    BROKEN_TRAFFIC_LIGHT = "broken_traffic_light"
    FALLEN_TREE = "fallen_tree"
    POWER_OUTAGE = "power_outage"
    CRIME = "crime"
    ROAD_ACCIDENT = "road_accident"
    OTHER = "other"


class ReportStatus(str, enum.Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    RESOLVED = "resolved"
    REJECTED = "rejected"


class Report(Base):

    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    category = Column(
        SAEnum(IncidentCategory, values_callable=_enum_values, name="incidentcategory"),
        nullable=False,
        index=True,
    )

    description = Column(Text, nullable=True)

    image_path = Column(String, nullable=True)

    latitude = Column(Float, nullable=False, index=True)

    longitude = Column(Float, nullable=False, index=True)

    address = Column(String, nullable=True)

    status = Column(
        SAEnum(ReportStatus, values_callable=_enum_values, name="reportstatus"),
        nullable=False,
        default=ReportStatus.PENDING,
        server_default=ReportStatus.PENDING.value,
    )

    # --- Populated by the AI pipeline on report creation ---
    ai_summary = Column(Text, nullable=True)

    severity_score = Column(Float, nullable=True)

    # AI's own image-based classification, independent of the category the
    # user selected at submission time - lets the UI flag a mismatch
    # (e.g. user picked "pothole" but the photo looks like flooding).
    ai_category = Column(
        SAEnum(IncidentCategory, values_callable=_enum_values, name="incidentcategory"),
        nullable=True,
    )

    ai_confidence = Column(Float, nullable=True)

    # --- Populated by duplicate detection, alongside the AI pipeline ---
    # Deliberately separate from `status` (ReportStatus) - a duplicate is
    # still a real, valid report that a moderator should look at; this is
    # a hint for them, not an automatic rejection.
    is_duplicate = Column(Boolean, nullable=False, default=False, server_default="false")

    # Points at the earlier report this one is likely a repeat of. No
    # ORM relationship exposed for this on purpose (self-referential
    # relationships add complexity - lazy loading, join direction - that
    # nothing currently needs; callers that want the other report's
    # details can fetch it by this id).
    duplicate_of_id = Column(
        Integer,
        ForeignKey("reports.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", backref="reports")
