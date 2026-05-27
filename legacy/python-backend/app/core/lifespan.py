from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.database import AsyncSessionLocal
from app.services.position.position_service import PositionService
from app.portfolio.portfolio_manager import PortfolioManager
from app.core.logger import logger


@asynccontextmanager
async def lifespan(app: FastAPI):

    logger.info("Starting Trading Bot API")

    async with AsyncSessionLocal() as db:
        position_service = PositionService(db)
        positions = await position_service.get_all_positions()
        await PortfolioManager.load_positions(positions)
        logger.info(
            f"Loaded {len(positions)} positions from database "
            f"on API startup."
        )

    yield

    logger.info("Stopping Trading Bot API")
