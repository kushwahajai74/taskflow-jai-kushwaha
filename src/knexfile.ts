import type { Knex } from "knex";
import dotenv from "dotenv";
import path from "path";

// Load environment variables - handle both dev (ts-node) and prod (compiled JS)
const envPath = process.env.NODE_ENV === 'production' 
  ? path.resolve(__dirname, "../.env")
  : path.resolve(process.cwd(), ".env");

dotenv.config({ path: envPath });

const config: Knex.Config = {
  client: "pg",
  connection: process.env.DATABASE_URL || "postgres://localhost:5432/taskflow",
  migrations: {
    // Path is relative to this file's compiled location (dist/knexfile.js).
    // Always use compiled JS — both in dev and production.
    directory: "./migrations",
    extension: "js",
  },
  useNullAsDefault: true,
};

export default config;
