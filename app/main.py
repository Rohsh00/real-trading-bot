from fastapi import FastAPI

from app.api.health import router as health_router
from app.api.strategy import router as strategy_router
from app.api.portfolio import router as portfolio_router
from app.api.signals import router as signals_router
from app.api.orders import router as orders_router
from app.api.broker import router as broker_router
from app.api.audit import router as audit_router

from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.exceptions import (
    AppException,
    app_exception_handler
)
from app.api.backtest import (
    router as backtest_router
)
from app.api.candles import (
    router as candles_router
)
from app.core.lifespan import lifespan


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(
    AppException,
    app_exception_handler
)

app.include_router(
    health_router,
    prefix="/api/v1"
)

app.include_router(
    candles_router,
    prefix="/api/v1"
)

app.include_router(
    backtest_router,
    prefix="/api/v1"
)

app.include_router(
    strategy_router,
    prefix="/api/v1"
)

app.include_router(
    portfolio_router,
    prefix="/api/v1"
)

app.include_router(
    signals_router,
    prefix="/api/v1"
)

app.include_router(
    orders_router,
    prefix="/api/v1"
)

app.include_router(
    broker_router,
    prefix="/api/v1"
)

app.include_router(
    audit_router,
    prefix="/api/v1"
)


@app.get("/")
async def root():

    return {
        "success": True,
        "message": "Trading Bot API Running"
    }
