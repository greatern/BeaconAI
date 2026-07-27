"""create reports table

Revision ID: ca4bbc9e4f9b
Revises: e5eedef3bdf1
Create Date: 2026-07-27 05:48:02.854439

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ca4bbc9e4f9b'
down_revision: Union[str, Sequence[str], None] = 'e5eedef3bdf1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


incident_category = sa.Enum(
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
)

report_status = sa.Enum(
    "pending",
    "verified",
    "resolved",
    "rejected",
    name="reportstatus",
)


def upgrade() -> None:
    """Upgrade schema."""
    bind = op.get_bind()
    incident_category.create(bind, checkfirst=True)
    report_status.create(bind, checkfirst=True)

    op.create_table(
        "reports",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("category", incident_category, nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("image_path", sa.String(), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=False),
        sa.Column("longitude", sa.Float(), nullable=False),
        sa.Column("address", sa.String(), nullable=True),
        sa.Column(
            "status",
            report_status,
            nullable=False,
            server_default="pending",
        ),
        sa.Column("ai_summary", sa.Text(), nullable=True),
        sa.Column("severity_score", sa.Float(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
    )

    op.create_index(op.f("ix_reports_id"), "reports", ["id"], unique=False)
    op.create_index(op.f("ix_reports_user_id"), "reports", ["user_id"], unique=False)
    op.create_index(op.f("ix_reports_category"), "reports", ["category"], unique=False)
    op.create_index(op.f("ix_reports_latitude"), "reports", ["latitude"], unique=False)
    op.create_index(op.f("ix_reports_longitude"), "reports", ["longitude"], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f("ix_reports_longitude"), table_name="reports")
    op.drop_index(op.f("ix_reports_latitude"), table_name="reports")
    op.drop_index(op.f("ix_reports_category"), table_name="reports")
    op.drop_index(op.f("ix_reports_user_id"), table_name="reports")
    op.drop_index(op.f("ix_reports_id"), table_name="reports")
    op.drop_table("reports")

    bind = op.get_bind()
    report_status.drop(bind, checkfirst=True)
    incident_category.drop(bind, checkfirst=True)
