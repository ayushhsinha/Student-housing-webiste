import postgres from "postgres";

// TODO: IMPORT FROM ENV
export const queryClient = postgres(
  `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
);
