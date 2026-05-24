import asyncio

from app.portfolio.portfolio_manager import (
    PortfolioManager
)

from app.core.logger import logger


async def main():

    while True:

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
