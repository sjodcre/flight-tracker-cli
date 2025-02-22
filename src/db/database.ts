import Database from "better-sqlite3";

const db = new Database("flights.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_airport TEXT,
    to_airport TEXT,
    date TEXT,
    price INTEGER,
    timestamp TEXT
  )
`);

export function savePrice(from: string, to: string, date: string, price: number) {
  const stmt = db.prepare(
    "INSERT INTO prices (from_airport, to_airport, date, price, timestamp) VALUES (?, ?, ?, ?, ?)"
  );
  stmt.run(from, to, date, price, new Date().toISOString());
  console.log("💾 Flight price saved to database!");
}
// not used