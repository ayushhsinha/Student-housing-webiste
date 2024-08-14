import { describe, expect, test, it, beforeEach } from "bun:test";
import { Properties, valid_lat_long } from "src/properties";
import { db } from "db/db";
import { companies, properties } from "db/schema";
import { buildJSONRequest } from "./common.test";
import { v4 } from "uuid";
import { eq } from "drizzle-orm";
import { testCompany, createTestProperty, testProperty } from "./common.test";

describe("Properties Unit Tests", () => {
  // Testing valid_lat_long function
  it("should check for exactly one period in the latitude", () => {
    expect(valid_lat_long("1.11.")).toBe(false);
    expect(valid_lat_long("1")).toBe(false);
  });

  it("should check for non-numeric characters in the latitude", () => {
    expect(valid_lat_long("1.1a")).toBe(false);
    expect(valid_lat_long("1.1-")).toBe(false);
  });

  it("should return true for a valid latitude", () => {
    expect(valid_lat_long("1.111111")).toBe(true);
  });

  it("should return false for not enough precision", () => {
    expect(valid_lat_long("1.11")).toBe(false);
  });
});

describe("Properties Endpoints", () => {
  // Delete all properties before each test
  beforeEach(async () => {
    await db.delete(properties);
    await db.delete(companies);
  });

  it("should return 404 for invalid property ID", async () => {
    const res = await Properties.handle(
      buildJSONRequest(`/properties/${v4()}`, "GET", {}),
    );
    expect(res.status).toBe(404);
  });

  it("should return the correct property", async () => {
    await createTestProperty();

    const res = await Properties.handle(
      buildJSONRequest(`/properties/${testProperty.public_id}`, "GET", {}),
    );

    expect(res.status).toBe(200);
  });

  it("should return a list of properties", async () => {
    await createTestProperty();

    const res = await Properties.handle(
      buildJSONRequest("/properties", "GET", {}),
    );

    expect(res.status).toBe(200);
    expect((await res.json()).length).toBe(1);
  });

  it("should create a new property", async () => {
    await createTestProperty();
    const res = await Properties.handle(
      buildJSONRequest("/properties", "POST", {
        name: "New Property",
        owner_id: testCompany.public_id,
        address: "New Address",
        latitude: "1.111",
        longitude: "2.222",
      }),
    );

    expect(res.status).toBe(200);

    const newProperty = await db.query.properties.findFirst({
      where: eq(properties.name, "New Property"),
    });

    expect(newProperty).toBeDefined();
    expect(newProperty?.name).toBe("New Property");
    expect(newProperty?.address).toBe("New Address");
    expect(newProperty?.latitude).toBe("1.111");
    expect(newProperty?.longitude).toBe("2.222");
    expect(newProperty?.owner).toBe(testCompany.public_id);
  });

  it("should fail to create a new property with invalid latitude", async () => {
    await createTestProperty();
    const res = await Properties.handle(
      buildJSONRequest("/properties", "POST", {
        name: "New Property",
        owner_id: testCompany.public_id,
        address: "New Address",
        latitude: "1.11a",
        longitude: "2.222",
      }),
    );

    expect(res.status).toBe(400);
  });

  it("should fail to create a new property with invalid longitude", async () => {
    await createTestProperty();
    const res = await Properties.handle(
      buildJSONRequest("/properties", "POST", {
        name: "New Property",
        owner_id: testCompany.public_id,
        address: "New Address",
        latitude: "1.111",
        longitude: "2.22a",
      }),
    );

    expect(res.status).toBe(400);
  });

  it("should delete a property", async () => {
    await createTestProperty();

    const res = await Properties.handle(
      buildJSONRequest(`/properties/${testProperty.public_id}`, "DELETE", {}),
    );

    expect(res.status).toBe(200);

    const deletedProperty = await db.query.properties.findFirst({
      where: eq(properties.public_id, testProperty.public_id),
    });

    expect(deletedProperty).toBeUndefined();
  });
});
