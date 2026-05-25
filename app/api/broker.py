import yaml
from fastapi import APIRouter
from app.risk.risk_manager import RiskManager

router = APIRouter()


@router.get("/broker/status")
async def get_broker_status():
    """
    Returns broker mode, name, and risk manager configuration.
    """
    try:
        with open("config/broker_config.yaml", "r") as f:
            config = yaml.safe_load(f)
        broker_name = config.get("broker", "unknown")
    except Exception:
        broker_name = "unknown"

    return {
        "broker": broker_name,
        "mode": "Paper Trading" if broker_name == "paper" else "Live Trading",
        "is_paper": broker_name == "paper",
        "risk_manager": {
            "max_position_size": RiskManager.MAX_POSITION_SIZE,
            "currency": "USD",
        },
    }
