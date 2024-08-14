import { Elysia, t } from "elysia";
import { db } from "../db/db";

export const Partners = new Elysia({ prefix: "partners" })
  // this API is giving the property name, latitude and longitude when "/" is hit,
  .get("/location", async ({ set }) => {
    const res = await db.query.properties.findMany();

    const notnullcoordinates = [];

    const coordinatesArray = res.map((row) => ({
      propertyname: row.name,
      latitude: row.latitude,
      longitude: row.longitude,
    }));

    for (const coordinates of coordinatesArray) {
      const property_name = coordinates.propertyname;
      const latitude = coordinates.latitude;
      const longitude = coordinates.longitude;

      if (latitude !== null && longitude !== null) {
        notnullcoordinates.push({ property_name, latitude, longitude });
      }
    }
    return notnullcoordinates;
  })
  .get("/name", async ({ set }) => {
    const res = await db.query.properties.findMany({
      columns: {
        name: true,
      },
    });
    return res;
  });
