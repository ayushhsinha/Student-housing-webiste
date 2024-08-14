import { describe, expect, test, it, beforeEach } from "bun:test";
import { Partners } from "src/partners";
import { buildJSONRequest, testPicture, testUnit } from "./common.test";
import { contactForm, properties, companies, units, rooms } from "db/schema";
import { db } from "db/db";
import { createTestProperty, testProperty, testRooms } from "./common.test";
import { App } from "src";
import { v4 } from "uuid";
import { Rooms } from "src/rooms";
import { eq } from "drizzle-orm";
import { Pictures } from "src/pictures";

describe("Pictures API", () => {
    beforeEach(async () => {
        await db.delete(properties);
        await db.delete(companies);
        await db.delete(units);
        await db.delete(rooms);
    });

    it("should return a list of Pictures]", async () => {
        await createTestProperty();
        const response = await Pictures.handle(
            buildJSONRequest("/pictures", "GET", {}),
        );
        expect(response.status).toBe(200);
    });

    it("should return 404 for invalid unit id", async () => {
        const response = await Pictures.handle(
            buildJSONRequest(`/picture/${v4()}`, "GET", {}),
        );
        expect(response.status).toBe(404);
    });

    it("should return the correct room", async () => {
        await createTestProperty();

        const response = await Pictures.handle(
            buildJSONRequest(`/picture/${testPicture.unit}`, "GET", {}),
        );

        expect(response.status).toBe(200);
    });
});