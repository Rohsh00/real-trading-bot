import fs from "fs";
import path from "path";

export interface CSVRow {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  [key: string]: any;
}

export class CSVLoader {
  static loadCsv(filePath: string): CSVRow[] {
    const absolutePath = path.resolve(process.cwd(), filePath);
    const content = fs.readFileSync(absolutePath, "utf8");
    const lines = content.split("\n");
    if (lines.length === 0) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const data: CSVRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(",");
      const row: any = {};

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
export default CSVLoader;
