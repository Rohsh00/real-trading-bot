export abstract class BaseStrategy {
  static registry: { [key: string]: new (...args: any[]) => BaseStrategy } = {};

  abstract generateSignal(symbol: string, price: number): Promise<void>;

  static register(name: string, constructor: new (...args: any[]) => BaseStrategy) {
    this.registry[name] = constructor;
  }

  static create(name: string, config?: any): BaseStrategy {
    const StrategyClass = this.registry[name];
    if (!StrategyClass) {
      throw new Error(`Strategy '${name}' not found in registry. Available: ${Object.keys(this.registry)}`);
    }
    return new StrategyClass(config);
  }
}
export default BaseStrategy;
