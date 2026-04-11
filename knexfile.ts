import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

const config: Knex.Config = {
  client: "pg",
  connection: process.env.DATABASE_URL || "postgres://localhost:5432/taskflow",
  migrations: {
    directory: "./src/migrations",
    extension: "ts",
  },
  useNullAsDefault: true,
};

export default config;
