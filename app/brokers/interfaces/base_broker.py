from abc import ABC
from abc import abstractmethod


class BaseBroker(ABC):

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
