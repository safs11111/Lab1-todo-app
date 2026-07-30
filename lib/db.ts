import "server-only";

import Database from "better-sqlite3";
import { existsSync } from "node:fs";
import path from "node:path";

const databasePath = path.join(
  process.cwd(),
  "data",
  "tasks.db",
);

if (!existsSync(databasePath)) {
  throw new Error(
    "Database not found. Run `node db/migrate.js` before starting the application.",
  );
}

const database = new Database(databasePath);

database.pragma("foreign_keys = ON");

export default database;