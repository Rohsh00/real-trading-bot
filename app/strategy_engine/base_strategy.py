from abc import ABC
from abc import abstractmethod
from typing import Dict, Type

class BaseStrategy(ABC):

    _registry: Dict[str, Type['BaseStrategy']] = {}

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        if hasattr(cls, 'strategy_name'):
            BaseStrategy._registry[cls.strategy_name] = cls

    @abstractmethod
    async def generate_signal(
        self,
        symbol: str,
        price: float
    ):
        pass

    @classmethod
    def create(cls, strategy_name: str, **kwargs) -> 'BaseStrategy':
        if strategy_name not in cls._registry:
            raise ValueError(f"Strategy '{strategy_name}' not found in registry. Available strategies: {list(cls._registry.keys())}")
        return cls._registry[strategy_name](**kwargs)
