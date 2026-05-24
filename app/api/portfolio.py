from fastapi import APIRouter

from app.portfolio.portfolio_manager import (
    PortfolioManager
)

router = APIRouter()


@router.get("/portfolio")

async def get_portfolio():

    return {
        "cash_balance":
            PortfolioManager.cash_balance,

        "positions":
            PortfolioManager.positions,

        "realized_pnl":
            PortfolioManager.realized_pnl
    }
