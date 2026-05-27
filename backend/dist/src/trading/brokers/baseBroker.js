"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBroker = void 0;
class BaseBroker {
    static registry = {};
    static register(name, constructor) {
        this.registry[name] = constructor;
    }
    static create(name) {
        const BrokerClass = this.registry[name];
        if (!BrokerClass) {
            throw new Error(`Broker '${name}' not found in registry. Available: ${Object.keys(this.registry)}`);
        }
        return new BrokerClass();
    }
}
exports.BaseBroker = BaseBroker;
exports.default = BaseBroker;
