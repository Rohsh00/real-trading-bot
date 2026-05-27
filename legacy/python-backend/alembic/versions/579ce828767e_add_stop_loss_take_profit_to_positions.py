"""add stop loss take profit to positions

Revision ID: 579ce828767e
Revises: b42b6ff2afbf
Create Date: 2026-05-24 12:42:48.350263
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "579ce828767e"
down_revision: Union[str, Sequence[str], None] = "b42b6ff2afbf"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    op.add_column(
        "positions",
        sa.Column(
            "stop_loss",
            sa.Float(),
            nullable=True
        )
    )

    op.add_column(
        "positions",
        sa.Column(
            "take_profit",
            sa.Float(),
            nullable=True
        )
    )


def downgrade() -> None:

    op.drop_column(
        "positions",
        "take_profit"
    )

    op.drop_column(
        "positions",
        "stop_loss"
    )
