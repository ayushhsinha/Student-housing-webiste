import { describe, expect, test, it, beforeEach } from "bun:test";
import { Partners } from "src/partners";
import { buildJSONRequest } from "./common.test";
import { contactForm, properties, companies, units, rooms } from "db/schema";
import { db } from "db/db";
import { createTestProperty, testProperty, testRooms } from "./common.test";
import { App } from "src";
import { v4 } from "uuid";
import { Rooms } from "src/rooms";
import { eq } from "drizzle-orm";

describe("Rooms API", () => {
  beforeEach(async () => {
    await db.delete(properties);
    await db.delete(companies);
    await db.delete(units);
    await db.delete(rooms);
  });

  it("should return a list of Rooms", async () => {
    await createTestProperty();
    const response = await Rooms.handle(buildJSONRequest("/rooms", "GET", {}));

    expect(response.status).toBe(200);
  });
  it("should return 404 for invalid room id", async () => {
    const response = await Rooms.handle(
      buildJSONRequest(`/rooms/${v4()}`, "GET", {}),
    );
    expect(response.status).toBe(404);
  });

  it("should return the correct room", async () => {
    await createTestProperty();

    const response = await Rooms.handle(
      buildJSONRequest(`/rooms/${testRooms.unit}`, "GET", {}),
    );

    expect(response.status).toBe(200);
  });

  it("should delete a room", async () => {
    await createTestProperty();

    const res = await Rooms.handle(
      buildJSONRequest(`/rooms/${testRooms.unit}`, "DELETE", {}),
    );

    expect(res.status).toBe(200);

    const deletedProperty = await db.query.rooms.findFirst({
      where: eq(rooms.unit, testRooms.unit),
    });

    expect(deletedProperty).toBeUndefined();
  });

  it("should return the first room of a unit", async () => {
    await createTestProperty();

    const response = await Rooms.handle(
      buildJSONRequest(`/rooms/unitToRoom/${testRooms.unit}`, "GET", {}),
    );

    expect(response.status).toBe(200);
  });

  it("should return 404 for invalid unit id", async () => {
    const response = await Rooms.handle(
      buildJSONRequest(`/rooms/unitToRoom/${v4()}`, "GET", {}),
    );
    expect(response.status).toBe(404);
  });
});
