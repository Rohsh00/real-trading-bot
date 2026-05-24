from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.position.position_service import PositionService
from app.portfolio.portfolio_manager import (
    PortfolioManager
)

router = APIRouter()


@router.get("/portfolio")
async def get_portfolio(
    db: AsyncSession = Depends(get_db)
):

    position_service = PositionService(db)
    positions = await position_service.get_all_positions()

    positions_dict = {
        pos.symbol: {
            "quantity": pos.quantity,
            "average_price": pos.average_price,
            "stop_loss": pos.stop_loss,
            "take_profit": pos.take_profit
        }
        for pos in positions
    }

    cash_balance = await PortfolioManager.get_cash_balance()
    realized_pnl = await PortfolioManager.get_realized_pnl()

    return {
        "cash_balance": cash_balance,
        "positions": positions_dict,
        "realized_pnl": realized_pnl
    }
