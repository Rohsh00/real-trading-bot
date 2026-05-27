from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.core.database import get_db
from app.cache.redis import redis_client

router = APIRouter()


def get_memory_info():
    meminfo = {}
    try:
        with open('/proc/meminfo', 'r') as f:
            for line in f:
                parts = line.split(':')
                if len(parts) == 2:
                    key = parts[0].strip()
                    # value is usually like "16382104 kB"
                    val = parts[1].strip().split()[0]
                    meminfo[key] = int(val)
        
        total = meminfo.get('MemTotal', 0)
        available = meminfo.get('MemAvailable', 0)
        used = total - available
        
        return {
            "total_mb": total // 1024,
            "used_mb": used // 1024,
            "available_mb": available // 1024
        }
    except Exception as e:
        return {"error": f"Could not read memory info: {e}"}


@router.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):

    components_status = {
        "redis": "unknown",
        "database": "unknown"
    }
    
    is_healthy = True

    # Check Redis
    try:
        if await redis_client.ping():
            components_status["redis"] = "connected"
        else:
            components_status["redis"] = "unresponsive"
            is_healthy = False
    except Exception:
        components_status["redis"] = "disconnected"
        is_healthy = False

    # Check Database
    try:
        await db.execute(text("SELECT 1"))
        components_status["database"] = "connected"
    except Exception:
        components_status["database"] = "disconnected"
        is_healthy = False

    response_data = {
        "success": is_healthy,
        "service": "trading-bot",
        "status": "healthy" if is_healthy else "unhealthy",
        "components": components_status,
        "memory": get_memory_info()
    }

    if not is_healthy:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content=response_data
        )

    return response_data
