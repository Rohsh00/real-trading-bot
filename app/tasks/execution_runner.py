import asyncio
import traceback

import orjson

from app.cache.redis import (
    redis_client
)

from app.execution.execution_engine import (
    ExecutionEngine
)

from app.core.database import (
    AsyncSessionLocal
)

from app.services.execution.execution_service import (
    ExecutionService
)

from app.services.position.position_service import (
    PositionService
)

from app.portfolio.portfolio_manager import (
    PortfolioManager
)

from app.core.logger import logger


async def main():

    from app.services.audit_service import AuditService

    # Load positions from database on startup
    async with AsyncSessionLocal() as db:
        position_service = PositionService(db)
        positions = await position_service.get_all_positions()
        await PortfolioManager.load_positions(positions)
        logger.info(
            f"Execution Runner loaded {len(positions)} positions "
            f"from database."
        )
        await AuditService.log_event(
            db,
            event_type="SYSTEM",
            event_name="SYSTEM_STARTUP",
            details={"positions_loaded": len(positions), "service": "execution_runner"}
        )

    pubsub = redis_client.pubsub()

    await pubsub.subscribe(
        "trading_signals"
    )

    logger.info(
        "Execution Engine Subscribed"
    )

    engine = ExecutionEngine()

    async for message in pubsub.listen():

        if message["type"] != "message":
            continue

        signal = orjson.loads(
            message["data"]
        )

        execution_result = (
            await engine.execute_signal(
                signal
            )
        )

        if execution_result:

            async with (
                AsyncSessionLocal()
            ) as db:

                service = (
                    ExecutionService(db)
                )

                await service.persist_execution(
                    execution_result
                )

                logger.info(
                    f"Execution persisted: "
                    f"{execution_result}"
                )


async def run_with_recovery():
    while True:
        try:
            await main()
        except Exception as e:
            logger.error(f"Execution Runner crashed: {e}")
            logger.error(traceback.format_exc())
            logger.info("Restarting Execution Runner in 5 seconds...")
            await asyncio.sleep(5)


if __name__ == "__main__":

    asyncio.run(run_with_recovery())