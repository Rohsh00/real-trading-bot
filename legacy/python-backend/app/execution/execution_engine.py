import yaml
import json
import hashlib

from app.cache.redis import redis_client

from app.portfolio.portfolio_manager import (
    PortfolioManager
)

from app.risk.risk_manager import (
    RiskManager
)

from app.brokers.factory.broker_factory import (
    BrokerFactory
)

from app.core.logger import logger


class ExecutionEngine:

    DEFAULT_QUANTITY = 0.01

    def __init__(self):
        import asyncio
        self.locks = {}
        
        with open(
            "config/broker_config.yaml",
            "r"
        ) as file:

            config = yaml.safe_load(file)

        broker_name = config["broker"]

        self.broker = (
            BrokerFactory.get_broker(
                broker_name
            )
        )

    async def execute_signal(
        self,
        signal: dict
    ):
        import asyncio
        symbol = signal["symbol"]

        # Idempotency Protection
        if "idempotency_key" in signal:
            idempotency_key = f"execution:idempotency:{signal['idempotency_key']}"
        else:
            signal_str = json.dumps(signal, sort_keys=True)
            signal_hash = hashlib.sha256(signal_str.encode()).hexdigest()
            idempotency_key = f"execution:idempotency:{signal_hash}"

        acquired = await redis_client.set(idempotency_key, "1", nx=True, ex=10)
        if not acquired:
            logger.warning(f"Duplicate execution blocked by idempotency key: {idempotency_key}")
            return

        if symbol not in self.locks:
            self.locks[symbol] = asyncio.Lock()

        async with self.locks[symbol]:
            side = signal["signal"]

        price = signal["price"]

        quantity = self.DEFAULT_QUANTITY

        current_position = (
            PortfolioManager.positions.get(symbol)
        )

        if side == "BUY" and current_position:

            logger.info(
                f"Already holding {symbol}"
            )

            return

        if side == "SELL" and not current_position:

            logger.info(
                f"No open position for {symbol}"
            )

            return

        is_allowed = (
            await RiskManager.validate_order(
                symbol=symbol,
                quantity=quantity,
                price=price,
                side=side
            )
        )

        if not is_allowed:

            logger.warning(
                "Risk manager rejected order"
            )

            return

        order = await self.broker.place_order(
            symbol=symbol,
            side=side,
            quantity=quantity,
            price=price
        )

        await PortfolioManager.update_position(
            symbol=symbol,
            side=side,
            quantity=quantity,
            price=price
        )

        logger.info(
            f"Execution Complete: {order}"
        )

        return order
