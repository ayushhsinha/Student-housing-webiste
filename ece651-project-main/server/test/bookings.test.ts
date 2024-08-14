import { App } from "src";
import { db } from "db/db";
import { describe, beforeEach, afterEach, it, expect, test } from "bun:test";
import {
  users,
  sessions,
  properties,
  companies,
  units,
  rooms,
  bookings,
} from "db/schema";
import { testRooms } from "./common.test";
import {
  buildJSONRequest,
  createTestProperty,
  generateTestUser,
} from "./common.test";
import { eq } from "drizzle-orm";
import { v4 } from "uuid";
import { generateId } from "lucia";

const testBooking = {
  start_date: "2023-01-01",
  end_date: "2023-01-02",
  room_id: testRooms.public_id,
};

describe("Bookings API", () => {
  beforeEach(async () => {
    await db.delete(users);
    await db.delete(sessions);
    await db.delete(properties);
    await db.delete(companies);
    await db.delete(units);
    await db.delete(rooms);
    await db.delete(bookings);
  });

  afterEach(async () => {
    await db.delete(users);
    await db.delete(sessions);
    await db.delete(properties);
    await db.delete(companies);
    await db.delete(units);
    await db.delete(rooms);
    await db.delete(bookings);
  });

  describe("POST /bookings", () => {
    it("should create a booking", async () => {
      const user = await generateTestUser();
      const sessionId = "1";

      // Create a session for the user
      const session = await db.insert(sessions).values({
        id: sessionId,
        userId: user.id,
        expiresAt: new Date(Date.now() + 3600000), // Expires in 1 hour
      });

      await createTestProperty();

      const response = await App.handle(
        buildJSONRequest(
          "/bookings/create",
          "POST",
          testBooking,
          `auth_session=${sessionId}`,
        ),
      );

      expect(response.status).toBe(200);

      const booking = await db.query.bookings.findFirst({
        where: eq(bookings.user_id, user.id),
      });

      expect(booking).toBeDefined();
      expect(booking?.room_id).toBe(testBooking.room_id);
      expect(new Date(booking?.start_date || "")).toStrictEqual(
        new Date(testBooking.start_date),
      );
      expect(new Date(booking?.end_date || "")).toStrictEqual(
        new Date(testBooking.end_date),
      );

      const room = await db.query.rooms.findFirst({
        where: eq(rooms.public_id, testBooking.room_id),
      });

      expect(room).toBeDefined();
      expect(room?.reserved).toBe(true);
    });

    it("should return 401 if user is not logged in", async () => {
      const response = await App.handle(
        buildJSONRequest("/bookings/create", "POST", testBooking),
      );

      expect(response.status).toBe(401);
    });

    it("should return 400 if start date is before room availability", async () => {
      const user = await generateTestUser();
      const sessionId = "1";

      // Create a session for the user
      const session = await db.insert(sessions).values({
        id: sessionId,
        userId: user.id,
        expiresAt: new Date(Date.now() + 3600000), // Expires in 1 hour
      });

      await createTestProperty();

      const response = await App.handle(
        buildJSONRequest(
          "/bookings/create",
          "POST",
          {
            ...testBooking,
            start_date: "2022-12-31",
          },
          `auth_session=${sessionId}`,
        ),
      );

      expect(response.status).toBe(400);
    });

    it("should return 400 if end date is before start date", async () => {
      const user = await generateTestUser();
      const sessionId = "1";

      // Create a session for the user
      const session = await db.insert(sessions).values({
        id: sessionId,
        userId: user.id,
        expiresAt: new Date(Date.now() + 3600000), // Expires in 1 hour
      });

      await createTestProperty();

      const response = await App.handle(
        buildJSONRequest(
          "/bookings/create",
          "POST",
          {
            ...testBooking,
            end_date: "2023-02-01",
            start_date: "2023-03-02",
          },
          `auth_session=${sessionId}`,
        ),
      );

      expect(response.status).toBe(400);
    });

    it("should return 400 if room is not available", async () => {
      const user = await generateTestUser();
      const sessionId = "1";

      // Create a session for the user
      const session = await db.insert(sessions).values({
        id: sessionId,
        userId: user.id,
        expiresAt: new Date(Date.now() + 3600000), // Expires in 1 hour
      });

      await createTestProperty();

      const response = await App.handle(
        buildJSONRequest(
          "/bookings/create",
          "POST",
          {
            ...testBooking,
            room_id: v4(),
          },
          `auth_session=${sessionId}`,
        ),
      );

      expect(response.status).toBe(400);
    });

    it("should return 400 if room is reserved", async () => {
      const user = await generateTestUser();
      const sessionId = "1";

      // Create a session for the user
      const session = await db.insert(sessions).values({
        id: sessionId,
        userId: user.id,
        expiresAt: new Date(Date.now() + 3600000), // Expires in 1 hour
      });

      await createTestProperty();

      await db
        .update(rooms)
        .set({ reserved: true })
        .where(eq(rooms.public_id, testRooms.public_id));

      const response = await App.handle(
        buildJSONRequest(
          "/bookings/create",
          "POST",
          testBooking,
          `auth_session=${sessionId}`,
        ),
      );

      expect(response.status).toBe(400);

      const booking = await db.query.bookings.findFirst({
        where: eq(bookings.user_id, user.id),
      });

      expect(booking).toBeUndefined();
    });
  });

  describe("GET /bookings/list", () => {
    it("should return a list of bookings", async () => {
      const user = await generateTestUser();
      const sessionId = "1";

      // Create a session for the user
      const session = await db.insert(sessions).values({
        id: sessionId,
        userId: user.id,
        expiresAt: new Date(Date.now() + 3600000), // Expires in 1 hour
      });

      await createTestProperty();

      const id1 = v4();
      const id2 = v4();

      await db.insert(bookings).values([
        {
          user_id: user.id,
          public_id: id1,
          room_id: testRooms.public_id,
          start_date: "2023-01-01",
          end_date: "2023-01-02",
          status: "pending",
        },
        {
          user_id: user.id,
          public_id: id2,
          room_id: testRooms.public_id,
          start_date: "2023-01-03",
          end_date: "2023-01-04",
          status: "confirmed",
        },
      ]);

      const response = await App.handle(
        buildJSONRequest(
          "/bookings/list",
          "GET",
          {},
          `auth_session=${sessionId}`,
        ),
      );

      expect(response.status).toBe(200);
    });

    it("should return 401 if user is not logged in", async () => {
      const response = await App.handle(
        buildJSONRequest("/bookings/list", "GET", {}),
      );

      expect(response.status).toBe(401);
    });
  });

  describe("DELETE /bookings/delete/:booking_id", () => {
    it("should delete a booking", async () => {
      const user = await generateTestUser();
      const sessionId = "1";

      // Create a session for the user
      const session = await db.insert(sessions).values({
        id: sessionId,
        userId: user.id,
        expiresAt: new Date(Date.now() + 3600000), // Expires in 1 hour
      });

      await createTestProperty();

      const booking = await db
        .insert(bookings)
        .values({
          user_id: user.id,
          public_id: v4(),
          room_id: testRooms.public_id,
          start_date: "2023-01-01",
          end_date: "2023-01-02",
          status: "pending",
        })
        .returning();

      await db
        .update(rooms)
        .set({ reserved: true })
        .where(eq(rooms.public_id, testRooms.public_id));

      const response = await App.handle(
        buildJSONRequest(
          `/bookings/delete/${booking[0].public_id}`,
          "DELETE",
          {},
          `auth_session=${sessionId}`,
        ),
      );

      expect(response.status).toBe(200);

      const deletedBooking = await db.query.bookings.findFirst({
        where: eq(bookings.public_id, booking[0].public_id),
      });

      expect(deletedBooking).toBeUndefined();

      const room = await db.query.rooms.findFirst({
        where: eq(rooms.public_id, testRooms.public_id),
      });

      expect(room).toBeDefined();
      expect(room?.reserved).toBe(false);
    });

    it("should return 401 if user is not logged in", async () => {
      const response = await App.handle(
        buildJSONRequest(`/bookings/delete/${v4()}`, "DELETE", {}),
      );

      expect(response.status).toBe(401);
    });

    it("should return 400 if booking is not found", async () => {
      const user = await generateTestUser();
      const sessionId = "1";

      // Create a session for the user
      const session = await db.insert(sessions).values({
        id: sessionId,
        userId: user.id,
        expiresAt: new Date(Date.now() + 3600000), // Expires in 1 hour
      });

      await createTestProperty();

      const response = await App.handle(
        buildJSONRequest(
          `/bookings/delete/${v4()}`,
          "DELETE",
          {
            booking_id: v4(),
          },
          `auth_session=${sessionId}`,
        ),
      );

      expect(response.status).toBe(400);

      const deletedBooking = await db.query.bookings.findFirst();

      expect(deletedBooking).toBeUndefined();
    });

    it("should return 401 if booking is not owned by user", async () => {
      const user = await generateTestUser();
      const sessionId = "1";

      const user2 = {
        id: generateId(15),
        firstname: "test2",
        lastname: "user2",
        hashed_password: await Bun.password.hash("testpassword"),
        email: "test2@example.com",
        verified_email: true,
      };

      await db.insert(users).values(user2);

      // Create a session for the first user
      const session = await db.insert(sessions).values({
        id: sessionId,
        userId: user.id,
        expiresAt: new Date(Date.now() + 3600000), // Expires in 1 hour
      });

      await createTestProperty();

      const booking = await db
        .insert(bookings)
        .values({
          user_id: user2.id,
          public_id: v4(),
          room_id: testRooms.public_id,
          start_date: "2023-01-01",
          end_date: "2023-01-02",
          status: "pending",
        })
        .returning();

      const response = await App.handle(
        buildJSONRequest(
          `/bookings/delete/${booking[0].public_id}`,
          "DELETE",
          {},
          `auth_session=${sessionId}`,
        ),
      );

      expect(response.status).toBe(401);

      const notDeletedBooking = await db.query.bookings.findFirst({
        where: eq(bookings.public_id, booking[0].public_id),
      });

      expect(notDeletedBooking).toBeDefined();
    });
  });
});
