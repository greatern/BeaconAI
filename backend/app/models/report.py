import enum

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Text,
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
    # --- Populated by the AI pipeline later; nullable until then ---
    ai_summary = Column(Text, nullable=True)

    severity_score = Column(Float, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", backref="reports")
