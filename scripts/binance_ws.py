import json
import websocket
import redis
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.core.config import settings

REDIS_CHANNEL = "market_ticks"

r = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=settings.REDIS_DB, decode_responses=True)

SOCKET = f"{settings.BINANCE_WS_BASE_URL}/ws/btcusdt@trade"


def on_message(ws, message):
    data = json.loads(message)

    tick = {
        "symbol": data["s"],
        "price": float(data["p"]),
        "quantity": float(data["q"]),
        "trade_time": data["T"]
    }

    r.publish(REDIS_CHANNEL, json.dumps(tick))

    print(f"Published Tick: {tick}")


def on_error(ws, error):
    print("Error:", error)


def on_close(ws, close_status_code, close_msg):
    print("WebSocket closed")


def on_open(ws):
    print("Connected to Binance WebSocket")


if __name__ == "__main__":
    ws = websocket.WebSocketApp(
        SOCKET,
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close
    )

    ws.run_forever()

