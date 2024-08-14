import { t } from "elysia";
import pino from "pino";
import { env } from "bun";

export const logger = pino({
  level: env.LOG_LEVEL ? env.LOG_LEVEL : "info",
});

export const HOST =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "some other url";

export interface DatabaseUserAttributes {
  firstname: string;
  lastname: string;
  email: string;
  verified_email: boolean;
}

export type DrizzlePostgresError = {
  name: string;
  severity_local: string;
  severity: string;
  code: string;
  detail: string;
  schema_name: string;
  table_name: string;
  constraint_name: string;
  file: string;
  originalLine: number;
  originalColumn: number;
  routine: string;
};

export const ContactFormRequestBody = t.Object({
  firstname: t.String({
    description: "First name of the person sending the inquiry",
    error: JSON.stringify({ status: 200, message: "Firstname is required." }),
  }),
  lastname: t.String({
    description: "Last name of the person sending the inquiry",
    error: JSON.stringify({ status: 200, message: "Lastname is required." }),
  }),
  email: t.String({
    format: "email",
    description: "Email of the person sending the inquiry",
    error: JSON.stringify({
      status: 200,
      message: "A valid email is required.",
    }),
  }),
  phone_number: t.String({
    description: "Phone number of the person sending the inquiry",
    error: JSON.stringify({
      status: 200,
      message: "phone number is required.",
    }),
  }),
  message: t.String({
    description: "Message to be passed on to customer service agents",
    error: JSON.stringify({ status: 200, message: "Message is required." }),
  }),
});
