import pytest
from datetime import datetime
from uuid import uuid4
from decimal import Decimal

from app.api.health import health_check
from app.api.backtest import run_backtest
from app.api.strategy import create_strategy, list_strategies
from app.api.candles import get_candles
from app.api.portfolio import get_portfolio
from app.schemas.strategy import StrategyCreate
from app.core.database import AsyncSessionLocal, engine
from app.models.candle import Candle
from app.services.position.position_service import PositionService
from app.services.execution.execution_service import ExecutionService
from app.portfolio.portfolio_manager import PortfolioManager

@pytest.mark.asyncio
async def test_health_endpoint():
    response = await health_check()
    assert response["success"] is True
    assert response["status"] == "healthy"

@pytest.mark.asyncio
async def test_backtest_endpoint():
    response = await run_backtest()
    assert "total_trades" in response
    assert "final_balance" in response

@pytest.mark.asyncio
async def test_strategies_lifecycle():
    await engine.dispose()
    unique_name = f"Test Strategy {uuid4()}"
    payload = StrategyCreate(
        name=unique_name,
        description="Integration test strategy",
        config={"ema_short": 10, "ema_long": 21}
    )
    
    async with AsyncSessionLocal() as db:
        # 1. Create Strategy
        strategy_data = await create_strategy(payload=payload, db=db)
        assert strategy_data.name == unique_name
        assert strategy_data.is_active is True
        
        # 2. List Strategies
        strategies = await list_strategies(db=db)
        assert any(s.name == unique_name for s in strategies)

@pytest.mark.asyncio
async def test_candles_retrieval():
    await engine.dispose()
    symbol = f"TESTBTC_{uuid4().hex[:6]}"
    timeframe = "1h"
    
    # Insert a dummy candle
    async with AsyncSessionLocal() as db:
        candle = Candle(
            id=str(uuid4()),
            symbol=symbol,
            timeframe=timeframe,
            timestamp=datetime.utcnow(),
            open=50000.0,
            high=51000.0,
            low=49000.0,
            close=50500.0,
            volume=10.5
        )
        db.add(candle)
        await db.commit()

        # Call get_candles handler directly
        response = await get_candles(symbol=symbol, timeframe=timeframe, limit=10, db=db)
        
    assert len(response) > 0
    assert response[0].symbol == symbol
    assert response[0].timeframe == timeframe

@pytest.mark.asyncio
async def test_portfolio_positions_lifecycle():
    await engine.dispose()
    symbol = f"TESTPOS_{uuid4().hex[:6]}"
    
    async with AsyncSessionLocal() as db:
        pos_service = PositionService(db)
        exec_service = ExecutionService(db)
        
        # 1. Ensure position is clean
        await pos_service.close_position(symbol)
        
        # Check starting state via handler
        portfolio = await get_portfolio(db=db)
        assert symbol not in portfolio["positions"]
        
        # 2. Simulate BUY execution
        buy_result = {
            "symbol": symbol,
            "side": "BUY",
            "quantity": 0.05,
            "price": 1000.0
        }
        await exec_service.persist_execution(buy_result)
        
        # 3. Verify positions table holds BUY
        pos = await pos_service.get_position(symbol)
        assert pos is not None
        assert pos.quantity == 0.05
        assert pos.average_price == 1000.0
        
        # Check via handler
        portfolio = await get_portfolio(db=db)
        assert symbol in portfolio["positions"]
        assert portfolio["positions"][symbol]["quantity"] == 0.05
        assert portfolio["positions"][symbol]["average_price"] == 1000.0

        # 4. Simulate SELL execution
        sell_result = {
            "symbol": symbol,
            "side": "SELL",
            "quantity": 0.05,
            "price": 1050.0
        }
        await exec_service.persist_execution(sell_result)
        
        # 5. Verify positions table is empty again
        pos = await pos_service.get_position(symbol)
        assert pos is None
        
        # Check via handler again
        portfolio = await get_portfolio(db=db)
        assert symbol not in portfolio["positions"]
