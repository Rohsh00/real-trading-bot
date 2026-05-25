from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.order_repository import OrderRepository

router = APIRouter()


@router.get("/orders/recent")
async def get_recent_orders(
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    """
    Returns the last N executed orders from the database,
    ordered by most recent first.
    """
    repo = OrderRepository(db)
    orders = await repo.get_recent(limit=limit)
    return [
        {
            "id": str(o.id),
            "symbol": o.symbol,
            "side": o.side,
            "order_type": o.order_type,
            "quantity": float(o.quantity),
            "price": float(o.price),
            "status": o.status,
            "created_at": o.created_at.isoformat() if o.created_at else None,
        }
        for o in orders
    ]
