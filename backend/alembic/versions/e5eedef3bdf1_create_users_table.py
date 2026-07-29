"""create users table

Revision ID: e5eedef3bdf1
Revises: 
Create Date: 2026-07-27 05:48:02.464753

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e5eedef3bdf1'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("first_name", sa.String(), nullable=True),
        sa.Column("last_name", sa.String(), nullable=True),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("password", sa.String(), nullable=False),
        sa.Column("phone", sa.String(), nullable=True),
        sa.Column("home_lat", sa.Float(), nullable=True),
        sa.Column("home_lng", sa.Float(), nullable=True),
        sa.Column("work_lat", sa.Float(), nullable=True),
        sa.Column("work_lng", sa.Float(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
    )
   
    op.create_unique_constraint("uq_users_email", "users", ["email"])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint("uq_users_email", "users", type_="unique")
    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_table("users")
