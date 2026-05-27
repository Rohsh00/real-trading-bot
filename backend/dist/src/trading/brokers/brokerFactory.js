"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrokerFactory = void 0;
require("./paperBroker");
require("./fyersBroker");
const baseBroker_1 = require("./baseBroker");
class BrokerFactory {
    static getBroker(brokerName) {
        return baseBroker_1.BaseBroker.create(brokerName);
    }
}
exports.BrokerFactory = BrokerFactory;
exports.default = BrokerFactory;
