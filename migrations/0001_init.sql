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
