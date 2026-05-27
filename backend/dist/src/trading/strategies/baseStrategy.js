"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseStrategy = void 0;
class BaseStrategy {
    static registry = {};
    static register(name, constructor) {
        this.registry[name] = constructor;
    }
    static create(name, config) {
        const StrategyClass = this.registry[name];
        if (!StrategyClass) {
            throw new Error(`Strategy '${name}' not found in registry. Available: ${Object.keys(this.registry)}`);
        }
        return new StrategyClass(config);
    }
}
exports.BaseStrategy = BaseStrategy;
exports.default = BaseStrategy;
