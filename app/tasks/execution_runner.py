import asyncio

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

from app.core.logger import logger


async def main():

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


if __name__ == "__main__":

    asyncio.run(main())