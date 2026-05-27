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
        "market_ticks"
    )

    print("Subscribed to market_ticks")

    async for message in pubsub.listen():

        if message["type"] == "message":

            data = orjson.loads(
                message["data"]
            )

            print(f"Received Tick: {data}")


if __name__ == "__main__":

    asyncio.run(main())
