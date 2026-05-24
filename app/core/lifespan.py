from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.logger import logger


@asynccontextmanager
async def lifespan(app: FastAPI):

    logger.info("Starting Trading Bot API")

    yield

    logger.info("Stopping Trading Bot API")
