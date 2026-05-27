import asyncio
import orjson

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi import Depends

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.cache.redis import redis_client
from app.repositories.candle.candle_repository import CandleRepository

router = APIRouter()


@router.get("/candles")
async def get_candles(
    symbol: str,
    timeframe: str,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    repo = CandleRepository(db)
    candles = await repo.get_candles(
        symbol=symbol,
        timeframe=timeframe,
        limit=limit
    )
    return candles


@router.websocket("/ws/candles")
async def candles_websocket(
    websocket: WebSocket,
    symbol: str = "BTCUSDT",
    timeframe: str = "1m",
):
    """
    WebSocket endpoint that streams live (in-progress) candle updates
    from the stream_runner via Redis pub/sub.

    Connect: ws://127.0.0.1:8000/api/v1/ws/candles?symbol=BTCUSDT&timeframe=1m

    Each message is a JSON object:
    {
      "symbol": "BTCUSDT", "timeframe": "1m",
      "open": 76000, "high": 76100, "low": 75900, "close": 76050,
      "volume": 1.23, "timestamp": "2026-05-24T10:00:00", "is_live": true
    }
    """
    await websocket.accept()

    channel = f"live_candle_events:{symbol}:{timeframe}"
    pubsub = redis_client.pubsub()

    try:
        await pubsub.subscribe(channel)

        # Send the last known live candle immediately on connect
        # so the client doesn't wait for the next tick
        redis_key = f"live_candle:{symbol}:{timeframe}"
        last = await redis_client.get(redis_key)
        if last:
            await websocket.send_text(last)

        # Stream every tick update
        async for message in pubsub.listen():
            if message["type"] != "message":
                continue

            try:
                await websocket.send_text(message["data"])
            except WebSocketDisconnect:
                break
            except Exception:
                break

    except WebSocketDisconnect:
        pass
    except asyncio.CancelledError:
        pass
    finally:
        await pubsub.unsubscribe(channel)
        await pubsub.aclose()
