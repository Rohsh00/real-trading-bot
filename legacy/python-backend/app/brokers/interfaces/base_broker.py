from abc import ABC, abstractmethod
from typing import Dict, Type

class BaseBroker(ABC):

    _registry: Dict[str, Type['BaseBroker']] = {}

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        if hasattr(cls, 'broker_name'):
            BaseBroker._registry[cls.broker_name] = cls

    @classmethod
    def create(cls, broker_name: str, **kwargs) -> 'BaseBroker':
        if broker_name not in cls._registry:
            raise ValueError(f"Broker '{broker_name}' not found in registry. Available brokers: {list(cls._registry.keys())}")
        return cls._registry[broker_name](**kwargs)

    @abstractmethod
    async def place_order(
        self,
        symbol,
        side,
        quantity,
        price
    ):
        pass

    @abstractmethod
    async def cancel_order(
        self,
        order_id
    ):
        pass

    @abstractmethod
    async def get_positions(
        self
    ):
        pass

    @abstractmethod
    async def get_balance(
        self
    ):
        pass
