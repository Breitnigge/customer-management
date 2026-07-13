import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Renderの永続ディスクは /data にマウントされる
const DATA_DIR = process.env.RENDER ? "/data" : path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "customers.db");

declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

function getDb(): Database.Database {
  if (global.__db) return global.__db;
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT    NOT NULL,
      phone      TEXT    DEFAULT '',
      email      TEXT    DEFAULT '',
      memo       TEXT    DEFAULT '',
      created_at TEXT    DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT    DEFAULT (datetime('now', 'localtime'))
    );
    CREATE TABLE IF NOT EXISTS purchase_histories (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id   INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      purchase_date TEXT    NOT NULL,
      product_name  TEXT    NOT NULL,
      amount        INTEGER DEFAULT 0,
      memo          TEXT    DEFAULT '',
      created_at    TEXT    DEFAULT (datetime('now', 'localtime'))
    );
  `);
  global.__db = db;
  return db;
}

export default getDb();
export { DB_PATH };
