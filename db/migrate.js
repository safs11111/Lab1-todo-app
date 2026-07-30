const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const projectRoot = path.join(__dirname, "..");
const schemaPath = path.join(__dirname, "schema.sql");
const dataDirectory = path.join(projectRoot, "data");
const databasePath = path.join(dataDirectory, "tasks.db");

fs.mkdirSync(dataDirectory, { recursive: true });

const schema = fs.readFileSync(schemaPath, "utf8");

let database;

try {
  database = new Database(databasePath);
  database.pragma("foreign_keys = ON");
  database.exec(schema);

  console.log(`Database created successfully at: ${databasePath}`);
} catch (error) {
  console.error("Database creation failed:");
  console.error(error);
  process.exitCode = 1;
} finally {
  database?.close();
}