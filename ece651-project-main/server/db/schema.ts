// schema.js
import { json } from "drizzle-orm/mysql-core";
import {
  pgTable,
  bigint,
  varchar,
  pgSchema,
  decimal,
  uuid,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  date,
} from "drizzle-orm/pg-core";

/* Schema for authentication */

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  firstname: varchar("firstname", {
    length: 128,
  }).notNull(),
  lastname: varchar("lastname", {
    length: 128,
  }).notNull(),
  email: varchar("email", {
    length: 256,
  })
    .notNull()
    .unique(),
  hashed_password: varchar("hashed_password", {
    length: 256,
  })
    .notNull()
    .unique(),
  verified_email: boolean("verified_email").notNull().default(false),
});

export const email_verification = pgTable("email_verification", {
  id: serial("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id),
  verification_code: text("verification_code").notNull(),
  expires_at: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const password_reset = pgTable("password_reset", {
  reset_token: text("reset_token").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id),
  expires_at: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const sessions = pgTable("user_session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

/* Schema for Contact Form info */

export const contactForm = pgTable("contact_form", {
  id: serial("id").primaryKey(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  email: text("email").notNull(),
  phone_number: text("phone_number").notNull(),
  message: text("message").notNull(),
});

/* Schema for Properties */

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  public_id: uuid("public_id").notNull().unique(),
  name: varchar("name", {
    length: 255,
  }).notNull(),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  public_id: uuid("public_id").notNull().unique(),
  name: varchar("name", {
    length: 255,
  }).notNull(),
  owner: uuid("owner_id").references(() => companies.public_id, {
    onDelete: "cascade",
  }),
  address: varchar("address", {
    // Something we're going to have to think about more later when it comes to searchability
    length: 1024,
  }).notNull(),
  latitude: decimal("latitude", {
    precision: 6,
    scale: 3,
  }),
  longitude: decimal("longitude", {
    precision: 6,
    scale: 3,
  }),
});

export const bedrooms = pgEnum("bedrooms", ["1", "2", "3", "4", "5+"]);
export const bathrooms = pgEnum("bathrooms", [
  "1",
  "1.5",
  "2",
  "2.5",
  "3",
  "3.5",
  "4",
  "4.5",
  "5+",
]);

export const bedroomValues = bedrooms.enumValues;
export const bathroomValues = bathrooms.enumValues;

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  public_id: uuid("public_id").notNull().unique(),
  name: varchar("name", {
    length: 255,
  }),
  bathrooms: bathrooms("bathrooms"),
  bedrooms: bedrooms("bedrooms"),
  size: integer("size"),
  building: uuid("building_id")
    .notNull()
    .references(() => properties.public_id, { onDelete: "cascade" }),
});

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  public_id: uuid("public_id").notNull().unique(),
  unit: uuid("unit_id")
    .notNull()
    .references(() => units.public_id, { onDelete: "cascade" }),
  price: integer("price"),
  availability_from: date("availability_from"),
  size: integer("size"),
  utilities: varchar("utilities"),
  lease_term: varchar("lease_term"), // how many years of lease
  kitchen_utilities: varchar("kitchen_utilities"),
  internet: varchar("internet"),
  furnishings: varchar("furnishings"),
  parking: varchar("parking"),
  laundary_facilities: varchar("laundary_facilities"),
  study_room: varchar("study_room"),
  garden: varchar("garden"),
  train: varchar("train"),
  reserved: boolean("reserved").notNull().default(false),
});

export const picture = pgTable("picture", {
  id: serial("id").primaryKey(),
  public_id: uuid("public_id").notNull().unique(),
  unit: uuid("unit_id")
    .notNull()
    .references(() => units.public_id, { onDelete: "cascade" }),
  pic: text("pic").array(),
});

export const bookingStatus = pgEnum("booking_status", ["pending", "confirmed"]);

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  public_id: uuid("public_id").notNull().unique(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  room_id: uuid("room_id")
    .notNull()
    .references(() => rooms.public_id, { onDelete: "cascade" }),
  start_date: date("start_date"),
  end_date: date("end_date"),
  status: bookingStatus("status").notNull(),
});
