import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve sqlite3/dotenv from backend/node_modules (works in Docker and local monorepo).
const backendRoot = path.resolve(__dirname, "..", "backend");
const require = createRequire(path.join(backendRoot, "package.json"));
const sqlite3 = require("sqlite3");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

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
