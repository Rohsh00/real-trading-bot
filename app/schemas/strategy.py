from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class StrategyCreate(BaseModel):

    name: str
    description: Optional[str] = None
    config: dict


class StrategyResponse(BaseModel):

    id: UUID
    name: str
    description: Optional[str]
    config: dict
    is_active: bool

    class Config:
        from_attributes = True


class StrategyUpdate(BaseModel):

    is_active: Optional[bool] = None
    config: Optional[dict] = None
    name: Optional[str] = None
    description: Optional[str] = None