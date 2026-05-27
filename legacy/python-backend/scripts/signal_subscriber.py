import asyncio

import redis.asyncio as redis

import orjson


async def main():

    client = redis.Redis(
        host="localhost",
        port=6379,
        decode_responses=True
    )

    pubsub = client.pubsub()

    await pubsub.subscribe(
        "trading_signals"
    )

    print(
        "Subscribed to trading_signals"
    )

    async for message in pubsub.listen():

        if message["type"] == "message":

            signal = orjson.loads(
                message["data"]
            )

            print(
                f"Received Signal: {signal}"
            )


if __name__ == "__main__":

    asyncio.run(main())
