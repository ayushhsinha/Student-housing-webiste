import { Elysia, t } from "elysia";
import { db } from "../db/db";
import { eq } from "drizzle-orm";
import { properties } from "../db/schema";
import { v4 } from "uuid";

export function valid_lat_long(str: string) {
  // Check that str only has 0-9 and . as characters
  if (/[^\.\d]/.test(str)) {
    return false;
  }

  // Only one decimal place
  const split_str = str.split(".");
  if (split_str.length != 2) {
    return false;
  }

  // Correct amount of precision for final decimals (at least 3)
  if (split_str[1].length < 3) {
    return false;
  }
  return true;
}

export const Properties = new Elysia()
  .get(
    "/properties/:id",
    async ({ params: { id }, set }) => {
      const res = await db.query.properties.findFirst({
        where: eq(properties.public_id, id),
      });

      if (typeof res == "undefined") {
        set.status = "Not Found";
        return "Property not found";
      } else {
        return res;
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  .get("/properties", async ({ set }) => {
    const res = await db.query.properties.findMany();
    return res;
  })
  .post(
    "/properties",
    async ({ body: { name, owner_id, address, latitude, longitude }, set }) => {
      // Verify that lat and long are provided with exactly 3 units of precision
      if (latitude && !valid_lat_long(latitude)) {
        set.status = "Bad Request";
        return "Invalid latitude provided";
      }
      if (longitude && !valid_lat_long(longitude)) {
        set.status = "Bad Request";
        return "Invalid longitude provided";
      }

      await db.insert(properties).values({
        name,
        public_id: v4(),
        address,
        owner: owner_id,
        latitude,
        longitude,
      });
      return "ok";
    },
    {
      body: t.Object({
        name: t.String({ description: "Human-readable name of the property" }),
        owner_id: t.Optional(
          t.String({
            description: "ID of the company that owns the property",
          }),
        ),
        address: t.String({
          description: "Human-readable address of the property",
        }),
        latitude: t.Optional(
          t.String({
            description:
              "Geographic latitude of the property -- Should be to 3 units of precision, with decimal point shifted right 3 places",
          }),
        ),
        longitude: t.Optional(
          t.String({
            description:
              "Geographic longitude of the property -- Should be to 3 units of precision, with decimal point shifted right 3 places",
          }),
        ),
      }),
    },
  )
  .delete(
    "/properties/:id",
    async ({ params: { id }, set }) => {
      await db.delete(properties).where(eq(properties.public_id, id));
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  );
