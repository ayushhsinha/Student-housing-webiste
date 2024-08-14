import { describe, expect, test, it } from "bun:test";
import { contactFormService } from "src/contactFormService";
import { buildJSONRequest } from "./common.test";
import { contactForm } from "db/schema";
import { db } from "db/db";

describe("Contact Form Service", () => {
  it("should add to the contact form table", async () => {
    const response = await contactFormService.handle(
      buildJSONRequest("/submitContactForm", "POST", {
        firstname: "test",
        lastname: "user",
        email: "test@example.com",
        phone_number: "1234567890",
        message: "test message",
      }),
    );

    expect(response.status).toBe(200);

    const contactFormData = await db.query.contactForm.findFirst();
    expect(contactFormData).toBeDefined();
    expect(contactFormData?.firstname).toBe("test");
    expect(contactFormData?.lastname).toBe("user");
    expect(contactFormData?.email).toBe("test@example.com");
    expect(contactFormData?.phone_number).toBe("1234567890");
    expect(contactFormData?.message).toBe("test message");
  });
});
