import { Elysia, t } from "elysia";
import { db } from "../db/db";
import { eq, gte, lte, and, between } from "drizzle-orm";
import {
  bedroomValues,
  bathroomValues,
  properties,
  rooms,
  units,
  picture,
} from "../db/schema";
import { PgSelect } from "drizzle-orm/pg-core";

/* Query-building functions that take a dynamic query and add certain filters to them */

// Page is 0-indexed
export function withPagination<T extends PgSelect>(
  qb: T,
  page: number,
  pageSize: number,
) {
  return qb.limit(pageSize).offset(page * pageSize);
}

export function withPriceRange<T extends PgSelect>(
  qb: T,
  minPrice: number,
  maxPrice: number,
) {
  return qb.where(between(rooms.price, minPrice, maxPrice));
}

export function withBathrooms<T extends PgSelect>(
  qb: T,
  minBathrooms: (typeof bathroomValues)[number],
  maxBathrooms: (typeof bathroomValues)[number],
) {
  return qb.where(between(units.bathrooms, minBathrooms, maxBathrooms));
}

export function withBedrooms<T extends PgSelect>(
  qb: T,
  minBedrooms: (typeof bedroomValues)[number],
  maxBedrooms: (typeof bedroomValues)[number],
) {
  return qb.where(between(units.bedrooms, minBedrooms, maxBedrooms));
}

export function withSize<T extends PgSelect>(
  qb: T,
  minSize: number,
  maxSize: number,
) {
  return qb.where(between(rooms.size, minSize, maxSize));
}

export type RoomSearchResult = {
  cost: string;
  bedrooms: string;
  bathrooms: string;
  size: string;
  images: string[];
  propertyName: string;
  unitName: string;
  unitId: string;
  listingName: string;
};

export type PropertySearchResult = RoomSearchResult;

export const Search = new Elysia({ name: "Search", prefix: "search" })
  .get(
    "/properties",
    async ({ query }) => {
      let queryBuilder = db
        .select({
          cost: rooms.price,
          bedrooms: units.bedrooms,
          bathrooms: units.bathrooms,
          size: rooms.size,
          images: picture.pic,
          propertyName: properties.name,
          unitName: units.name,
          unitId: units.public_id,
        })
        .from(rooms)
        .innerJoin(units, eq(rooms.unit, units.public_id))
        .innerJoin(properties, eq(units.building, properties.public_id))
        .innerJoin(picture, eq(picture.unit, units.public_id))
        .$dynamic();

      if (query.name) {
        queryBuilder = queryBuilder.where(eq(properties.name, query.name));
      }

      if (query.id) {
        queryBuilder = queryBuilder.where(eq(properties.public_id, query.id));
      }

      const res = await queryBuilder.execute();
      return {
        success: 200,
        data: res.reduce<PropertySearchResult[]>((acc, row) => {
          const listingName = row.unitName
            ? `${row.unitName} at ${row.propertyName}`
            : `Apartment at${row.propertyName}`;
          acc.push({
            cost: String(row.cost),
            bedrooms: row.bedrooms ? row.bedrooms : "Not Listed",
            bathrooms: row.bathrooms ? row.bathrooms : "Not Listed",
            size: row.size ? String(row.size + "sqm") : "Not Listed",
            images: row.images ? row.images : [],
            propertyName: row.propertyName,
            unitName: row.unitName ? row.unitName : "Not Listed",
            unitId: row.unitId,
            listingName: listingName,
          });
          return acc;
        }, []),
      };
    },
    {
      query: t.Object({
        name: t.Optional(t.String()),
        id: t.Optional(t.String()),
      }),
    },
  )
  .get(
    "/rooms",
    async ({ query }) => {
      const page = typeof query.page === "undefined" ? 0 : parseInt(query.page);
      const perPage =
        typeof query.per_page === "undefined" ? 10 : parseInt(query.per_page);

      let queryBuilder = db
        .select({
          cost: rooms.price,
          bedrooms: units.bedrooms,
          bathrooms: units.bathrooms,
          size: rooms.size,
          images: picture.pic,
          propertyName: properties.name,
          unitName: units.name,
          unitId: units.public_id,
        })
        .from(rooms)
        .innerJoin(units, eq(rooms.unit, units.public_id))
        .innerJoin(properties, eq(units.building, properties.public_id))
        .innerJoin(picture, eq(picture.unit, units.public_id))
        .$dynamic();

      if (query.min_price && query.max_price) {
        const minPrice = parseInt(query.min_price);
        const maxPrice = parseInt(query.max_price);
        queryBuilder = withPriceRange(queryBuilder, minPrice, maxPrice);
      }

      if (query.min_bathrooms && query.max_bathrooms) {
        queryBuilder = withBathrooms(
          queryBuilder,
          query.min_bathrooms,
          query.max_bathrooms,
        );
      }

      if (query.min_bedrooms && query.max_bedrooms) {
        queryBuilder = withBedrooms(
          queryBuilder,
          query.min_bedrooms,
          query.max_bedrooms,
        );
      }

      if (query.min_size && query.max_size) {
        const minSizeInt = parseInt(query.min_size);
        const maxSizeInt = parseInt(query.max_size);
        queryBuilder = withSize(queryBuilder, minSizeInt, maxSizeInt);
      }

      queryBuilder = withPagination(queryBuilder, page, perPage);

      const res = await queryBuilder.execute();
      return {
        success: 200,
        data: res.reduce<RoomSearchResult[]>((acc, row) => {
          const listingName = row.unitName
            ? `${row.unitName} at ${row.propertyName}`
            : `Apartment at${row.propertyName}`;
          acc.push({
            cost: String(row.cost),
            bedrooms: row.bedrooms ? row.bedrooms : "Not Listed",
            bathrooms: row.bathrooms ? row.bathrooms : "Not Listed",
            size: row.size ? String(row.size + "sqm") : "Not Listed",
            images: row.images ? row.images : [],
            propertyName: row.propertyName,
            unitName: row.unitName ? row.unitName : "Not Listed",
            unitId: row.unitId,
            listingName: listingName,
          });
          return acc;
        }, []),
      };
    },
    {
      query: t.Object({
        min_price: t.Optional(t.String()),
        max_price: t.Optional(t.String()),
        min_bathrooms: t.Optional(
          t.Union(bathroomValues.map((v) => t.Literal(v))),
        ),
        max_bathrooms: t.Optional(
          t.Union(bathroomValues.map((v) => t.Literal(v))),
        ),
        min_bedrooms: t.Optional(
          t.Union(bedroomValues.map((v) => t.Literal(v))),
        ),
        max_bedrooms: t.Optional(
          t.Union(bedroomValues.map((v) => t.Literal(v))),
        ),
        min_size: t.Optional(t.String()),
        max_size: t.Optional(t.String()),
        page: t.Optional(t.String()),
        per_page: t.Optional(t.String()),
      }),
    },
  );
