import { Elysia, t } from "elysia";
import { contactForm } from "db/schema";
import { ContactFormRequestBody } from "./common";
import { db } from "db/db";
import swagger from "@elysiajs/swagger";

const contactFormSubmitted={
  status:200,
  message:"Contact form submitted successfully."
}
export const contactFormService = new Elysia().post(
  "/submitContactForm",
  async ({ body: { firstname, lastname, email, phone_number, message } }) => {
    await db.insert(contactForm).values({
      firstname,
      lastname,
      email,
      phone_number,
      message,
    });

    return new Response(JSON.stringify(contactFormSubmitted));
  },
  {
    detail: {
      tags: ["Contact Form"],
      description: "Submit a contact form request.",
      responses: {
        200: {
          description: "Successful form submission",
        },
        400: {
          description: "Error on invalid user data provided",
        },
        500: {
          description: "Error on internal sever error",
        },
      },
    },
    body: ContactFormRequestBody,
  },
);
