import { describe, expect, test, it, beforeEach } from "bun:test";
import { Partners } from "src/partners";
import { buildJSONRequest } from "./common.test";
import { contactForm, properties, companies } from "db/schema";
import { db } from "db/db";
import { createTestProperty, testProperty } from "./common.test";
import { App } from "src";

describe("Partners API", () => {
  // Delete all properties before each test
  beforeEach(async () => {
    await db.delete(properties);
    await db.delete(companies);
  });

  it("should return a list of partners", async () => {
    await createTestProperty();

    const response = await App.handle(
      buildJSONRequest("/partners/location", "GET", {}),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toStrictEqual([
      {
        property_name: "Property 1",
        latitude: "1.110",
        longitude: "2.220",
      },
    ]);
  });

  it("should return a list of partners with names", async () => {
    await createTestProperty();

    const response = await App.handle(
      buildJSONRequest("/partners/name", "GET", {}),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toStrictEqual([
      {
        name: "Property 1",
      },
    ]);
  });
});
