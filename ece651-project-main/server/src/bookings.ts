import { bookings, picture, properties, rooms, units } from "../db/schema";
import { Elysia, t } from "elysia";
import { db } from "../db/db";
import { authCheck } from "./auth";
import { v4 } from "uuid";
import { eq, and, TransactionRollbackError } from "drizzle-orm";
import { logger } from "./common";

export const Bookings = new Elysia({
  name: "Bookings",
  prefix: "bookings",
})
  .use(authCheck)
  .post(
    "/create",
    async ({ body: { start_date, end_date, room_id }, user }) => {
      if (!user) {
        return new Response("Not logged in", {
          status: 401,
        });
      }

      const room = await db.query.rooms.findFirst({
        where: eq(rooms.public_id, room_id),
      });

      if (!room) {
        return new Response("Room not found", {
          status: 400,
        });
      }
      if (start_date > end_date) {
        return new Response("Invalid date range", {
          status: 400,
        });
      }
      if (
        room.availability_from &&
        start_date < new Date(room.availability_from)
      ) {
        return new Response("Booking is not available", {
          status: 400,
        });
      }

      try {
        const resp = await db.transaction(async (tx) => {
          const booking = await tx.insert(bookings).values({
            public_id: v4(),
            user_id: user.id,
            room_id,
            start_date: start_date.toDateString(),
            end_date: end_date.toDateString(),
            status: "pending",
          });

          const update = await tx
            .update(rooms)
            .set({
              reserved: true,
            })
            .where(and(eq(rooms.public_id, room_id), eq(rooms.reserved, false)))
            .returning();

          if (update.length === 0) {
            tx.rollback();
          }

          return new Response(JSON.stringify({ booking }), {
            status: 200,
          });
        });

        return resp;
      } catch (err) {
        if (err instanceof TransactionRollbackError) {
          return new Response("Booking is not available", {
            status: 400,
          });
        }
      }
    },
    {
      body: t.Object({
        start_date: t.Date({
          format: "YYYY-MM-DD",
          error: "Invalid start_date format (should be YYYY-MM-DD)",
        }),
        end_date: t.Date({
          format: "YYYY-MM-DD",
          error: "Invalid end_date format (should be YYYY-MM-DD)",
        }),
        room_id: t.String({
          format: "uuid",
          error: "Invalid room_id format (should be uuid)",
        }),
      }),
    },
  )
  .get("/list", async ({ user }) => {
    if (!user) {
      return new Response("Not logged in", {
        status: 401,
      });
    }

    const res = await db
      .select({
        bookings: bookings,
        units: units,
        pictures: picture.pic,
        property_name: properties.name,
      })
      .from(bookings)
      .innerJoin(rooms, eq(rooms.public_id, bookings.room_id))
      .innerJoin(units, eq(rooms.unit, units.public_id))
      .innerJoin(properties, eq(units.building, properties.public_id))
      .innerJoin(picture, eq(picture.unit, units.public_id))
      .where(eq(bookings.user_id, user.id));

    return new Response(JSON.stringify(res), {
      status: 200,
    });
  })
  .delete(
    "/delete/:booking_id",
    async ({ params: { booking_id }, user }) => {
      if (!user) {
        return new Response("Not logged in", {
          status: 401,
        });
      }

      const booking = await db.query.bookings.findFirst({
        where: eq(bookings.public_id, booking_id),
      });

      if (!booking) {
        return new Response("Booking not found", {
          status: 400,
        });
      }

      if (booking.user_id !== user.id) {
        return new Response("Not authorized", {
          status: 401,
        });
      }

      await db.transaction(async (tx) => {
        await tx.delete(bookings).where(eq(bookings.public_id, booking_id));
        await tx
          .update(rooms)
          .set({ reserved: false })
          .where(eq(rooms.public_id, booking.room_id));
      });

      return new Response("", {
        status: 200,
      });
    },
    {
      params: t.Object({
        booking_id: t.String({
          format: "uuid",
          error: "Invalid booking_id format (should be uuid)",
        }),
      }),
    },
  );
