import { Elysia, t } from "elysia";
import { db } from "../db/db";
import { eq } from "drizzle-orm";
import { picture, rooms } from "../db/schema";
import { v4 } from "uuid";

export const Pictures = new Elysia()
    .get(
        "/picture/:id",
        async ({ params: { id }, set }) => {
            const res = await db.query.picture.findFirst({
                where: eq(picture.unit, id),
            });
            if (typeof res == "undefined") {
                set.status = "Not Found";
                return "Pictures not Found";
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
    .get(
        "/pictures",
        async ({ }) => {
            const res = await db.query.picture.findMany();
            return res;
        }
    );