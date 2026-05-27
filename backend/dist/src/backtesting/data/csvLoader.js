"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSVLoader = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class CSVLoader {
    static loadCsv(filePath) {
        const absolutePath = path_1.default.resolve(process.cwd(), filePath);
        const content = fs_1.default.readFileSync(absolutePath, "utf8");
        const lines = content.split("\n");
        if (lines.length === 0)
            return [];
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line)
                continue;
            const cols = line.split(",");
            const row = {};
            for (let j = 0; j < headers.length; j++) {
                const val = cols[j]?.trim();
                const numVal = parseFloat(val);
                row[headers[j]] = isNaN(numVal) ? val : numVal;
            }
            data.push(row);
        }
        return data;
    }
}
exports.CSVLoader = CSVLoader;
exports.default = CSVLoader;
