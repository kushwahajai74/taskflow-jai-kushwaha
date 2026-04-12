import type { Knex } from "knex";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

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
