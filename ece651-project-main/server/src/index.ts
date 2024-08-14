import { contactFormService } from "./contactFormService";
import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { Properties } from "./properties";
import { Rooms } from "./rooms";
import { Pictures } from "./pictures";
import { Search } from "./search";
import { db } from "../db/db";
import { auth } from "./auth";
import { env } from "bun";
import { logger } from "./common";
import { Partners } from "./partners";
import { cors } from "@elysiajs/cors";
import { Bookings } from "./bookings";

export const App = new Elysia()
  .use(
    swagger({
      documentation: {
        tags: [
          { name: "Auth", description: "Authentication endpoints" },
          {
            name: "Contact Form",
            description: "Endpoints for submitting contact forms",
          },
        ],
      },
    }),
  )
  .use(
    cors({
      credentials: true,
      methods: ["GET", "POST", "DELETE", "PUT"],
      allowedHeaders: ["Content-Type", "Authorization", "auth_session"],
    }),
  )
  .onBeforeHandle(async (ctx) => {
    logger.debug({ ctx }, "Request received");
  })
  .onError(async ({ code, error, path, request }) => {
    const method = request.method;
    switch (code) {
      case "NOT_FOUND":
        logger.info({ code, path, method }, "Page not found");
        return new Response("<Insert quirky 404 message>", { status: 404 });

      case "PARSE":
      case "VALIDATION":
        logger.info({ code, path, method }, "Validation error");
        return new Response(JSON.stringify({ status: 400, message: error }), {
          status: 400,
        });
      case "INVALID_COOKIE_SIGNATURE":
      case "UNKNOWN":
      case "INTERNAL_SERVER_ERROR":
        logger.error({ code, error, path }, "An error occurred");
        return new Response("An internal server error occurred.", {
          status: 500,
        });
    }
  })
  .use(swagger())
  .use(Properties)
  .use(auth)
  .use(Properties)
  .use(Partners)
  .use(contactFormService)
  .use(Rooms)
  .use(Pictures)
  .use(Search)
  .use(Bookings)
  .get("/", () => "Hello World!")
  .post("/hello", () => "world")
  .get("/return500", () => {
    throw new Error("This is a test error");
  })
  .post("/repeat", ({ body: { message } }) => message, {
    body: t.Object({ message: t.String() }),
  })
  .post("/badrequest", ({ body: { message } }) => message, {
    body: t.Object({ message: t.String({ format: "email" }) }),
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${App.server?.hostname}:${App.server?.port}`,
);
