import { units } from "db/schema";
import { bedrooms, bathrooms } from "./../db/schema";
// import { units } from 'db/schema';
import { Elysia, t } from "elysia";
import { db } from "../db/db";
import { eq } from "drizzle-orm";
import { rooms } from "../db/schema";
import { v4 } from "uuid";

export const Rooms = new Elysia()
  .get(
    "/rooms/:id",
    async ({ params: { id }, set }) => {
      const res = await db
        .select({
          id: rooms.id,
          public_id: rooms.public_id,
          unit: units.public_id,
          price: rooms.price,
          availability_from: rooms.availability_from,
          size: rooms.size,
          utilities: rooms.utilities,
          lease_term: rooms.lease_term,
          kitchen_utilities: rooms.kitchen_utilities,
          internet: rooms.internet,
          furnishings: rooms.furnishings,
          parking: rooms.parking,
          laundary_facilities: rooms.laundary_facilities,
          study_room: rooms.study_room,
          garden: rooms.garden,
          train: rooms.train,
          beds: units.bedrooms,
          bathrooms: units.bathrooms,
        })
        .from(rooms)
        .where(eq(rooms.unit, id))
        .innerJoin(units, eq(rooms.unit, units.public_id));
      if (res.length == 0) {
        set.status = "Not Found";
        return "Room not found";
      } else {
        return { res };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  .get(
    "/rooms/unitToRoom/:id",
    async ({ params: { id }, set }) => {
      const res = await db
        .select({
          roomId: rooms.public_id,
        })
        .from(units)
        .innerJoin(rooms, eq(rooms.unit, units.public_id))
        .where(eq(rooms.unit, id))
        .limit(1);

      if (res.length == 0) {
        set.status = "Not Found";
        return "Room not found";
      } else {
        return { res };
      }
    },
    {
      detail: {
        tags: ["Rooms"],
        description: "Get a room by unit id",
        responses: {
          200: {
            description: "Successful response",
          },
          400: {
            description: "Error on invalid unit id provided",
          },
          500: {
            description: "Error on internal server error",
          },
        },
      },
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  .get("/rooms", async ({}) => {
    const res = await db.query.rooms.findMany();
    return res;
  })
  .delete(
    "/rooms/:id",
    async ({ params: { id }, set }) => {
      await db.delete(rooms).where(eq(rooms.unit, id));
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  );
