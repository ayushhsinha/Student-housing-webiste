import { test } from "bun:test";
// import { units } from './../db/schema';
import { db } from "db/db";
import { properties, companies, rooms, units, picture, users } from "db/schema";
import { v4 } from "uuid";
import { generateId } from "lucia";

export const testCompany = {
  public_id: v4(),
  name: "Company 1",
};

export const testProperty = {
  public_id: v4(),
  name: "Property 1",
  address: "Address 1",
  latitude: "1.11",
  longitude: "2.22",
  owner: testCompany.public_id,
};

export const testUnit = {
  public_id: v4(),
  name: "Unit 1",
  building: testProperty.public_id,
};

export const testRooms = {
  public_id: v4(),
  unit: testUnit.public_id,
  price: 1234,
  availability_from: "2023-01-01",
  size: 800,
  utilities: "included",
  internet: "included",
  parking: "included",
  furnishings: "bed, sofa",
  lease_term: "one year",
};

export const testPicture = {
  public_id: v4(),
  unit: testUnit.public_id,
  pic: ["qw", "we"],
};

export const generateTestUser = async () => {
  const user = {
    firstname: "test",
    lastname: "user",
    hashed_password: await Bun.password.hash("testpassword"),
    email: "test@example.com",
    id: generateId(15),
    verified_email: false,
  };
  await db.insert(users).values(user);
  return { ...user, password: "testpassword" };
};

export function buildJSONRequest(
  path: string,
  method: string,
  body: Object,
  cookies?: string,
  host: string = "localhost:3000",
  origin: string = "localhost:3000",
  query?: Record<string, string>,
) {
  const url = query
    ? new URL(path, "http://localhost:3000") + "?" + new URLSearchParams(query)
    : new URL(path, "http://localhost:3000");
  return new Request(url, {
    method,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies || "",
      Host: host,
      Origin: origin,
    },
  });
}

export async function createTestProperty() {
  await db.insert(companies).values({
    public_id: testCompany.public_id,
    name: testCompany.name,
  });

  await db.insert(properties).values({
    public_id: testProperty.public_id,
    owner: testCompany.public_id,
    name: testProperty.name,
    address: testProperty.address,
    latitude: testProperty.latitude,
    longitude: testProperty.longitude,
  });

  await db.insert(units).values({
    public_id: testUnit.public_id,
    name: testUnit.name,
    building: testProperty.public_id,
  });

  await db.insert(rooms).values({
    public_id: testRooms.public_id,
    unit: testUnit.public_id,
    price: testRooms.price,
    availability_from: testRooms.availability_from,
    size: testRooms.size,
    internet: testRooms.internet,
    parking: testRooms.parking,
    furnishings: testRooms.furnishings,
    lease_term: testRooms.lease_term,
  });

  await db.insert(picture).values({
    public_id: testPicture.public_id,
    unit: testPicture.unit,
    pic: testPicture.pic,
  });
}
