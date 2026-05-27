export abstract class BaseBroker {
  static registry: { [name: string]: new () => BaseBroker } = {};

  abstract placeOrder(symbol: string, side: string, quantity: number, price: number): Promise<any>;
  abstract cancelOrder(orderId: string): Promise<void>;
  abstract getPositions(): Promise<any[]>;
  abstract getBalance(): Promise<{ balance: number }>;

  static register(name: string, constructor: new () => BaseBroker) {
    this.registry[name] = constructor;
  }

  static create(name: string): BaseBroker {
    const BrokerClass = this.registry[name];
    if (!BrokerClass) {
      throw new Error(`Broker '${name}' not found in registry. Available: ${Object.keys(this.registry)}`);
    }
    return new BrokerClass();
  }
}
export default BaseBroker;
