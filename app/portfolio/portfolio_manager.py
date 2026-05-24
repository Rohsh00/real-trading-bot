from collections import defaultdict

from app.core.logger import logger


class PortfolioManager:

    cash_balance = 100000.0

    positions = defaultdict(dict)

    realized_pnl = 0.0

    @classmethod
    async def update_position(
        cls,
        symbol: str,
        side: str,
        quantity: float,
        price: float
    ):

        current_position = cls.positions.get(symbol)

        if side == "BUY":

            cls.cash_balance -= (
                quantity * price
            )

            cls.positions[symbol] = {
                "quantity": quantity,
                "average_price": price,
                "stop_loss": price * 0.98,
                "take_profit": price * 1.03
            }

        elif side == "SELL" and current_position:

            pnl = (
                price
                - current_position["average_price"]
            ) * quantity

            cls.realized_pnl += pnl

            cls.cash_balance += (
                quantity * price
            )

            cls.positions.pop(symbol)

            logger.info(
                f"Trade Closed. PnL={pnl}"
            )

        logger.info(
            f"Portfolio Updated: "
            f"Cash={cls.cash_balance}"
        )
