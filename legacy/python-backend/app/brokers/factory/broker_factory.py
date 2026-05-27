import importlib
import pkgutil
import app.brokers
from app.brokers.interfaces.base_broker import BaseBroker

class BrokerFactory:

    _loaded = False

    @classmethod
    def _load_brokers(cls):
        if cls._loaded:
            return
            
        package = app.brokers
        for _, module_name, is_pkg in pkgutil.iter_modules(package.__path__):
            if not is_pkg:
                importlib.import_module(f"{package.__name__}.{module_name}")
                
        cls._loaded = True

    @classmethod
    def get_broker(cls, broker_name="paper", **kwargs):
        cls._load_brokers()
        return BaseBroker.create(broker_name, **kwargs)
