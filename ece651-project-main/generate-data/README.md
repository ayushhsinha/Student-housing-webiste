# generate-data

This is a data generation tool that creates dummy data using faker.js

## Usage

Run the tool directly with `bun`, as `bun index.ts`. Ensure that the db is running in the top level first, otherwise the tool will not be able to connect.

The tool has the following commands:

- `generate <numProperties> <numUnits>` - Generates a specific number of properties (and companies) with a specific number of units per property.
- `delete` - Deletes all data from all tables. MAKE SURE YOU WANT TO DO THIS BEFORE CALLING THIS COMMAND.

You can also call the tool like `bun index.ts -h` to get more help and documentation.
