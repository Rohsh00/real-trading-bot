import logging
import sys

from pythonjsonlogger import jsonlogger

from app.core.config import settings


def setup_logger():

    logger = logging.getLogger()

    logger.setLevel(settings.LOG_LEVEL)

    log_handler = logging.StreamHandler(sys.stdout)

    formatter = jsonlogger.JsonFormatter(
        "%(asctime)s %(levelname)s %(name)s %(message)s"
    )

    log_handler.setFormatter(formatter)

    logger.handlers.clear()
    logger.addHandler(log_handler)

    return logger


logger = setup_logger()
