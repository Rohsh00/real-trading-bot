from fastapi import APIRouter

from app.backtesting.data.csv_loader import (
    CSVLoader
)

from app.backtesting.strategies.ema_backtest import (
    EMABacktestStrategy
)

from app.backtesting.backtest_engine import (
    BacktestEngine
)

router = APIRouter()


@router.get("/backtest")

async def run_backtest():

    dataframe = CSVLoader.load_csv(
        "data/btcusdt_sample.csv"
    )

    strategy = EMABacktestStrategy()

    engine = BacktestEngine(
        strategy=strategy
    )

    results = engine.run(
        dataframe
    )

    return results
