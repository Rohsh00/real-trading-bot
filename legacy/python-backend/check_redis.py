import asyncio
import orjson
from app.cache.redis import redis_client

async def main():
    val = await redis_client.get("system:risk_settings")
    print("Redis value:", val)
    if val:
        parsed = orjson.loads(val)
        print("Parsed type:", type(parsed))
        print("restricted_symbols type:", type(parsed.get("restricted_symbols")))
        print("restricted_symbols value:", parsed.get("restricted_symbols"))

asyncio.run(main())
