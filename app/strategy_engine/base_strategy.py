from abc import ABC
from abc import abstractmethod


class BaseStrategy(ABC):

    @abstractmethod
    async def generate_signal(
        self,
        symbol: str,
        price: float
    ):
        pass
