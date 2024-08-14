import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: "postgresql://postgres:postgrestest@0.0.0.0:5432/testdb",
  },
} satisfies Config;
