"""add duplicate detection fields to reports

Revision ID: a7f1c9d2e6b4
Revises: c3311af379f5
Create Date: 2026-08-06 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a7f1c9d2e6b4'
down_revision: Union[str, Sequence[str], None] = 'c3311af379f5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "reports",
        sa.Column("is_duplicate", sa.Boolean(), nullable=False, server_default="false"),
    )
    op.add_column(
        "reports",
        sa.Column("duplicate_of_id", sa.Integer(), nullable=True),
    )
    op.create_index(
        op.f("ix_reports_duplicate_of_id"), "reports", ["duplicate_of_id"], unique=False
    )
    op.create_foreign_key(
        "fk_reports_duplicate_of_id_reports",
        "reports",
        "reports",
        ["duplicate_of_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint("fk_reports_duplicate_of_id_reports", "reports", type_="foreignkey")
    op.drop_index(op.f("ix_reports_duplicate_of_id"), table_name="reports")
    op.drop_column("reports", "duplicate_of_id")
    op.drop_column("reports", "is_duplicate")
