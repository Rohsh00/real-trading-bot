import fs from "fs";
import path from "path";
import yaml from "yaml";
import { resolveWorkspacePath } from "../../core/config";

export class StrategyRegistry {
  private config: any;

  constructor() {
    const filePath = resolveWorkspacePath("config/strategy_config.yaml");
    const fileContent = fs.readFileSync(filePath, "utf8");
    this.config = yaml.parse(fileContent);
  }

  getSymbols(): string[] {
    return this.config.symbols || [];
  }
}
export default StrategyRegistry;
