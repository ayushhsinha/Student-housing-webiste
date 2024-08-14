import { faker } from "@faker-js/faker";
import { db as db } from "../server/db/db";
import * as schema from "../server/db/schema";
import { program, Option, Argument } from "commander";
import { v4 as genUuid } from "uuid";

async function createProperties(numUnits: number) {
  try {
    // Generate a company + a property
    const companyName = faker.company.name();
    const companyUuid = genUuid();

    const company = await db
      .insert(schema.companies)
      .values({
        public_id: companyUuid,
        name: companyName,
      })
      .returning();

    const propertyUuid = genUuid();
    const address = faker.location.streetAddress(false);
    const propertyName = faker.location.street();
    // This is roughly the center of KW, with a 10 km radius
    const [lat, long] = faker.location.nearbyGPSCoordinate({
      origin: [43.45326, -80.49902],
      radius: 10,
      isMetric: true,
    });

    const property = await db
      .insert(schema.properties)
      .values({
        name: propertyName,
        public_id: propertyUuid,
        address,
        latitude: String(lat),
        longitude: String(long),
        owner: company[0].public_id,
      })
      .returning();

    // Generate units for the property
    const units = [];
    for (let i = 0; i < numUnits; i++) {
      const unitNumber = faker.location.secondaryAddress();
      const unit = await db
        .insert(schema.units)
        .values({
          public_id: genUuid(),
          name: unitNumber,
          building: property[0].public_id,
        })
        .returning();

      units.push(unit[0].name);
    }

    console.log(
      `Generated company ${company[0].name} with property ${property[0].name}, and units ${units}`
    );
  } catch (e) {
    console.log(`Error generating company and property: ${e}`);
    throw e;
  }
}

program
  .command("delete")
  .description("Deletes all tables' data")
  .action(async () => {
    await db.delete(schema.user);
    await db.delete(schema.session);
    await db.delete(schema.key);
    await db.delete(schema.units);
    await db.delete(schema.properties);
    await db.delete(schema.companies);

    console.log("All tables deleted");
    process.exit(0);
  });

program
  .command("generate")
  .description("Generates sample data")
  .addArgument(
    new Argument(
      "<numProperties>",
      "Number of companies and properties to generate"
    ).argParser(parseInt)
  )
  .addArgument(
    new Argument(
      "<numUnits>",
      "Number of units per property to generate"
    ).argParser(parseInt)
  )
  .action(async (numProperties: number, numUnits: number) => {
    console.log(numProperties, numUnits);
    for (let i = 0; i < numProperties; i++) {
      await createProperties(numUnits);
    }
    process.exit(0);
  });

await program.parseAsync();
