"""add candle unique constraint

Revision ID: b42b6ff2afbf
Revises: e6a29d72e2aa
Create Date: 2026-05-24
"""

from typing import Sequence, Union

from alembic import op


revision: str = "b42b6ff2afbf"
down_revision: Union[str, None] = "e6a29d72e2aa"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    op.create_unique_constraint(
        "uq_candle_symbol_timeframe_timestamp",
        "candles",
        [
            "symbol",
            "timeframe",
            "timestamp"
        ]
    )


def downgrade() -> None:

    op.drop_constraint(
        "uq_candle_symbol_timeframe_timestamp",
        "candles",
        type_="unique"
    )
