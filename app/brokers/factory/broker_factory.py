from app.brokers.paper_broker import (
    PaperBroker
)


class BrokerFactory:

    @staticmethod
    def get_broker(
        broker_name="paper"
    ):

        brokers = {
            "paper": PaperBroker()
        }

        return brokers[broker_name]
