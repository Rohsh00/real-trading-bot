"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyRegistry = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yaml_1 = __importDefault(require("yaml"));
class StrategyRegistry {
    config;
    constructor() {
        const filePath = path_1.default.resolve(process.cwd(), "config/strategy_config.yaml");
        const fileContent = fs_1.default.readFileSync(filePath, "utf8");
        this.config = yaml_1.default.parse(fileContent);
    }
    getSymbols() {
        return this.config.symbols || [];
    }
}
exports.StrategyRegistry = StrategyRegistry;
exports.default = StrategyRegistry;
