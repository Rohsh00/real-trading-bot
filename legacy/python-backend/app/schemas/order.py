from pydantic import BaseModel


class OrderCreate(BaseModel):

    symbol: str
    side: str
    order_type: str
    quantity: float
    price: float


class OrderResponse(BaseModel):

    id: str
    symbol: str
    side: str
    order_type: str
    quantity: float
    price: float
    status: str

    class Config:
        from_attributes = True
