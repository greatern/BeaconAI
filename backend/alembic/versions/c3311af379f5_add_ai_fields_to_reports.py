"""add ai fields to reports

Revision ID: c3311af379f5
Revises: ca4bbc9e4f9b
Create Date: 2026-08-03 06:36:26.911887

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'c3311af379f5'
down_revision: Union[str, Sequence[str], None] = 'ca4bbc9e4f9b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Reuse the existing "incidentcategory" Postgres enum type created by the
# previous migration - create_type=False so this doesn't try (and fail)
# to CREATE TYPE a second time.
incident_category = postgresql.ENUM(
    "pothole",
    "water_leak",
    "flooding",
    "fire",
    "illegal_dumping",
    "broken_traffic_light",
    "fallen_tree",
    "power_outage",
    "crime",
    "road_accident",
    "other",
    name="incidentcategory",
    create_type=False,
)


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("reports", sa.Column("ai_category", incident_category, nullable=True))
    op.add_column("reports", sa.Column("ai_confidence", sa.Float(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("reports", "ai_confidence")
    op.drop_column("reports", "ai_category")
