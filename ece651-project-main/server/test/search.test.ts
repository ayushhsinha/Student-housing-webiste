import { describe, expect, test, it, beforeEach } from "bun:test";
import {
  contactForm,
  properties,
  companies,
  units,
  rooms,
  bedroomValues,
} from "db/schema";
import { createSeedData } from "./seed.test";
import { buildJSONRequest } from "./common.test";
import { Search, RoomSearchResult, PropertySearchResult } from "src/search";
import { Elysia, t } from "elysia";
import { App } from "src";
import { db } from "../db/db";
import { eq, min } from "drizzle-orm";
import { parse, v4 } from "uuid";

import {
  withBathrooms,
  withBedrooms,
  withSize,
  withPriceRange,
  withPagination,
} from "../src/search";

type SearchResponse = {
  success: number;
  data: RoomSearchResult[];
};

describe("Search Tests", () => {
  beforeEach(async () => {
    await db.delete(properties);
    await db.delete(companies);
    await db.delete(units);
    await db.delete(rooms);
  });

  describe("Search function unit tests", () => {
    const paginationCases = [
      [0, 1, 1, 1, 2],
      [0, 5, 1, 5, 6],
      [1, 5, 6, 10, 11],
      [2, 10, 21, 30, 31],
    ];

    test.each(paginationCases)(
      "paginate with %p pages and %p entries per page",
      async (
        page,
        perPage,
        firstEntryFirstPage,
        lastEntryFirstPage,
        firstEntrySecondPage,
      ) => {
        for (let i = 0; i < 100; i++) {
          await db.insert(properties).values({
            public_id: v4(),
            name: `Property ${i + 1}`,
            address: `Address ${i + 1}`,
            latitude: `1.111`,
            longitude: `2.222`,
          });
        }
        const response = await withPagination(
          db.select().from(properties).$dynamic(),
          page,
          perPage,
        );

        expect(response.length).toBe(perPage);
        expect(response[0].name).toBe(`Property ${firstEntryFirstPage}`);
        expect(response[response.length - 1].name).toBe(
          `Property ${lastEntryFirstPage}`,
        );

        const response2 = await withPagination(
          db.select().from(properties).$dynamic(),
          page + 1,
          perPage,
        );

        expect(response2.length).toBe(perPage);
        expect(response2[0].name).toBe(`Property ${firstEntrySecondPage}`);
      },
    );
  });

  describe("Properties API Endpoint Tests", () => {
    it("should do basic search", async () => {
      await createSeedData();
      const response = await App.handle(
        buildJSONRequest("/search/properties", "GET", {}),
      );
      const body = (await response.json()) as SearchResponse;

      expect(response.status).toBe(200);
      expect(body.data).toBeInstanceOf(Array<PropertySearchResult>);
    });

    it("should do search with name", async () => {
      await createSeedData();
      const response = await App.handle(
        buildJSONRequest(
          "/search/properties",
          "GET",
          {},
          undefined,
          "localhost:3000",
          "localhost:3000",
          {
            name: "Delbert Divide",
          },
        ),
      );

      const body = (await response.json()) as SearchResponse;

      expect(response.status).toBe(200);
      expect(body.data).toBeInstanceOf(Array<PropertySearchResult>);
      expect(body.data.length).toBeGreaterThan(0);
      body.data.forEach((room) => {
        expect(room.propertyName).toBe("Delbert Divide");
      });
    });

    it("should do search with id", async () => {
      await createSeedData();
      const response = await App.handle(
        buildJSONRequest(
          "/search/properties",
          "GET",
          {},
          undefined,
          "localhost:3000",
          "localhost:3000",
          {
            id: "7a2fb2cd-f000-4911-be20-996a559de9b6",
          },
        ),
      );

      const body = (await response.json()) as SearchResponse;

      expect(response.status).toBe(200);
      expect(body.data).toBeInstanceOf(Array<PropertySearchResult>);
      expect(body.data.length).toBeGreaterThan(0);
      body.data.forEach((room) => {
        expect(room.propertyName).toBe("Delbert Divide");
      });
    });
  });

  describe("Rooms API Endpoint Tests", () => {
    it("should do basic search", async () => {
      await createSeedData();
      const response = await App.handle(
        buildJSONRequest("search/rooms", "GET", {}),
      );
      const body = (await response.json()) as SearchResponse;

      expect(response.status).toBe(200);
      expect(body.data).toBeInstanceOf(Array<RoomSearchResult>);
      expect(body.data.length).toBe(10);
    });

    it("should do search with price range", async () => {
      await createSeedData();
      const response = await App.handle(
        buildJSONRequest(
          "search/rooms",
          "GET",
          {},
          undefined,
          "localhost:3000",
          "localhost:3000",
          {
            min_price: "0",
            max_price: "1000",
            per_page: "100",
          },
        ),
      );
      const body = (await response.json()) as SearchResponse;

      expect(response.status).toBe(200);
      expect(body.data).toBeInstanceOf(Array<RoomSearchResult>);
      expect(body.data.length).toBeGreaterThan(0);
      body.data.forEach((room) => {
        expect(parseInt(room.cost)).toBeGreaterThanOrEqual(0);
        expect(parseInt(room.cost)).toBeLessThanOrEqual(1000);
      });
    });

    it("should do search with bedrooms", async () => {
      await createSeedData();
      const response = await App.handle(
        buildJSONRequest(
          "search/rooms",
          "GET",
          {},
          undefined,
          "localhost:3000",
          "localhost:3000",
          {
            min_bedrooms: "1",
            max_bedrooms: "2",
            per_page: "100",
          },
        ),
      );
      const body = (await response.json()) as SearchResponse;

      expect(response.status).toBe(200);
      expect(body.data).toBeInstanceOf(Array<RoomSearchResult>);
      expect(body.data.length).toBeGreaterThan(0);
      body.data.forEach((room) => {
        expect(parseFloat(room.bedrooms)).toBeGreaterThanOrEqual(1);
        expect(parseFloat(room.bedrooms)).toBeLessThanOrEqual(2);
      });
    });

    it("should do search with bathrooms", async () => {
      await createSeedData();
      const response = await App.handle(
        buildJSONRequest(
          "search/rooms",
          "GET",
          {},
          undefined,
          "localhost:3000",
          "localhost:3000",
          {
            min_bathrooms: "1",
            max_bathrooms: "2",
            per_page: "100",
          },
        ),
      );
      const body = (await response.json()) as SearchResponse;

      expect(response.status).toBe(200);
      expect(body.data).toBeInstanceOf(Array<RoomSearchResult>);
      expect(body.data.length).toBeGreaterThan(0);
      body.data.forEach((room) => {
        expect(parseFloat(room.bathrooms)).toBeGreaterThanOrEqual(1);
        expect(parseFloat(room.bathrooms)).toBeLessThanOrEqual(2);
      });
    });

    it("should do search with size", async () => {
      await createSeedData();
      const response = await App.handle(
        buildJSONRequest(
          "search/rooms",
          "GET",
          {},
          undefined,
          "localhost:3000",
          "localhost:3000",
          {
            min_size: "20",
            max_size: "70",
            per_page: "100",
          },
        ),
      );
      const body = (await response.json()) as SearchResponse;

      expect(response.status).toBe(200);
      expect(body.data).toBeInstanceOf(Array<RoomSearchResult>);
      expect(body.data.length).toBeGreaterThan(0);
      body.data.forEach((room) => {
        expect(parseFloat(room.size)).toBeGreaterThanOrEqual(20);
        expect(parseFloat(room.size)).toBeLessThanOrEqual(70);
      });
    });

    it("should ignore incomplete search parameters", async () => {
      await createSeedData();
      const response = await App.handle(
        buildJSONRequest(
          "search/rooms",
          "GET",
          {},
          undefined,
          "localhost:3000",
          "localhost:3000",
          {
            max_price: "700",
            per_page: "100",
            min_bedrooms: "2",
          },
        ),
      );
      const body = (await response.json()) as SearchResponse;

      expect(response.status).toBe(200);
      expect(body.data).toBeInstanceOf(Array<RoomSearchResult>);
      expect(body.data.length).toBeGreaterThan(0);
      const nonMatching = body.data.filter(
        (room) => parseInt(room.cost) > 700 || room.bedrooms in ["1"],
      );

      expect(nonMatching.length).toBeGreaterThan(0);
    });
  });
});
