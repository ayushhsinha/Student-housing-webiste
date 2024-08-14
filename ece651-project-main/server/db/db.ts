import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import postgres from "postgres";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { queryClient } from "./queryClient";

export const db = drizzle(queryClient, { schema });

export const luciaAdapter = new DrizzlePostgreSQLAdapter(
  db,
  schema.sessions,
  schema.users,
);
