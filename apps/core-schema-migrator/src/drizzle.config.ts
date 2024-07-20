import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./node_modules/@total-report/core-schema/src/schema.ts", // FIXME: This should be a path to package, not a direct path to file
  out: "./migrations",
  dbCredentials: {
    url: process.env.DB_URL!,
  }
});