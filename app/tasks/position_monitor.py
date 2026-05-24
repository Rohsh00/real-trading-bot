import asyncio

from app.portfolio.portfolio_manager import (
    PortfolioManager
)

from app.core.database import (
    AsyncSessionLocal
)

from app.services.position.position_service import (
    PositionService
)

from app.core.logger import logger


async def main():

    while True:

        async with AsyncSessionLocal() as db:
            position_service = PositionService(db)
            positions = await position_service.get_all_positions()
            await PortfolioManager.load_positions(positions)

        for symbol, position in (
            PortfolioManager.positions.items()
        ):

            logger.info(
                f"Monitoring Position: "
                f"{symbol} "
                f"SL={position.get('stop_loss')} "
                f"TP={position.get('take_profit')}"
            )

        await asyncio.sleep(10)


if __name__ == "__main__":

    asyncio.run(main())
