// import fs from "fs";
import * as fs from "fs";


const FILE_PATH = "data.json";

export function savePrice(from: string, to: string, date: string, price: number) {
  let data: any[] = [];

  if (fs.existsSync(FILE_PATH)) {
    const fileContent = fs.readFileSync(FILE_PATH, "utf-8");
    data = JSON.parse(fileContent);
  }

  data.push({ from, to, date, price, timestamp: new Date().toISOString() });

  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  console.log("💾 Flight price saved!");
}
