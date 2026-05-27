from sqlalchemy.ext.asyncio import AsyncSession

from app.models.trade import Trade


class TradeRepository:

    def __init__(
        self,
        db: AsyncSession
    ):
        self.db = db

    async def create(
        self,
        trade: Trade
    ) -> Trade:

        self.db.add(trade)

        await self.db.commit()

        await self.db.refresh(trade)

        return trade
