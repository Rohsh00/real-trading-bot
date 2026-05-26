import asyncio
from app.risk.risk_manager import RiskManager

async def test():
    # simulate "DOGEUSDT" being restricted
    res = await RiskManager.validate_order("doge/usdt", 1.0, 1.0, "BUY")
    print(f"Validation for doge/usdt: {res}")
    
    res2 = await RiskManager.validate_order("BTCUSDT", 1.0, 1.0, "BUY")
    print(f"Validation for BTCUSDT: {res2}")

asyncio.run(test())
