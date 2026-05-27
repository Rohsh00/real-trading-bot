import "./paperBroker";
import "./fyersBroker";
import { BaseBroker } from "./baseBroker";

export class BrokerFactory {
  static getBroker(brokerName: string): BaseBroker {
    return BaseBroker.create(brokerName);
  }
}
export default BrokerFactory;
