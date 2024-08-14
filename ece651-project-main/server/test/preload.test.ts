import { beforeAll, mock } from "bun:test";
import { $ } from "bun";
import postgres from "postgres";
const connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// This sets the database objects used in the backend to point towards the test db docker container
// Schema pushing is done as part of running the test -- before docker containers are started

mock.module("db/queryClient", () => ({
  queryClient: postgres(connectionString),
}));
