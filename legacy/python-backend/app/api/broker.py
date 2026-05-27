import yaml
from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from fyers_apiv3 import fyersModel

from app.core.config import settings
from app.services.broker.fyers_token_service import FyersTokenService
from app.core.logger import logger
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

    from app.services.risk_service import RiskService
    settings = await RiskService.get_settings()

    return {
        "broker": broker_name,
        "mode": "Paper Trading" if broker_name == "paper" else "Live Trading",
        "is_paper": broker_name == "paper",
        "risk_manager": {
            "max_position_size": settings.get("max_position_size", 10000.0),
            "currency": "USD",
        },
    }


@router.get("/broker/fyers/login")
async def fyers_login():
    """
    Redirects the user to the Fyers OAuth login page.
    """
    session = fyersModel.SessionModel(
        client_id=settings.FYERS_APP_ID,
        secret_key=settings.FYERS_SECRET_KEY,
        redirect_uri=settings.FYERS_REDIRECT_URI,
        response_type="code",
        grant_type="authorization_code"
    )
    auth_url = session.generate_authcode()
    return RedirectResponse(url=auth_url)


@router.get("/broker/fyers/callback")
async def fyers_callback(
    s: str = None,
    code: str = None,
    auth_code: str = None
):
    """
    Handles the Fyers OAuth callback to exchange auth_code for access_token.
    """
    actual_code = auth_code or code
    if not actual_code:
        return {"success": False, "error": "No auth code received from Fyers"}
    
    try:
        session = fyersModel.SessionModel(
            client_id=settings.FYERS_APP_ID,
            secret_key=settings.FYERS_SECRET_KEY,
            redirect_uri=settings.FYERS_REDIRECT_URI,
            response_type="code",
            grant_type="authorization_code"
        )
        session.set_token(actual_code)
        response = session.generate_token()
        
        if response.get("s") == "ok":
            access_token = response.get("access_token")
            refresh_token = response.get("refresh_token")
            await FyersTokenService.save_token(access_token, refresh_token)
            return {"success": True, "message": "Fyers authenticated successfully!"}
        else:
            return {"success": False, "error": response.get("message", "Token generation failed")}
    except Exception as e:
        logger.error(f"Fyers Callback Error: {e}")
        return {"success": False, "error": str(e)}
