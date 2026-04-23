import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sqlite3 from "sqlite3";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = process.env.DB_FILE || "./minitasks.sqlite";
const dbPath = path.resolve(__dirname, dbFile);
const schemaPath = path.resolve(__dirname, "schema.sql");

fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const schemaSql = fs.readFileSync(schemaPath, "utf8");

const db = new sqlite3.Database(dbPath);

db.exec(schemaSql, (error) => {
  if (error) {
    console.error("Failed to initialize database:", error.message);
    db.close();
    process.exit(1);
    return;
  }

  console.log(`Database initialized at ${dbPath}`);
  db.close();
});
