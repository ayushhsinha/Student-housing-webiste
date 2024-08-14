# Utilized Libraries & Frameworks
This backend utilizes the following frameworks:
- [Lucia Auth](https://lucia-auth.com/getting-started/elysia/)
- [ElysiaJS](https://elysiajs.com/)
- [Drizzle ORM](https://orm.drizzle.team/)

Refer to the documentation and "Getting Started" guide of each framework for further information

# Documentation

## Directory Structure

The backend consists of the following directories and files

- `db` - Contains the DB schema and driver (Mostly consists of Drizzle & Lucia code)
  - `config.ts` - The configuration file Drizzle uses to establish a connection with the DB
  - `db.ts` - Exports the `db` object that can be used to build queries.
    - `db` - DB handle wrapped in Drizzle's query builder. Use this one to make queries as needed.
  - `queryClient.ts` - Exports a raw handle for querying the DB. This should only ever be used by Lucia.
  - `schema.ts` - Defines the schema for the entire DB. 
- `src` - All the driver code to serve the API (Mostly Elysia)
  - `index.ts` - Initializes the Elysia server and serves the API
  - `auth.ts` - Initializes and exports the handles used to interact with authentication, sessions, and user data
  - `contactFormService.ts` - Exports the Elysia router that handles contact form submission
  - `properties.ts` - Exports the Elysia router that handles property information CRUD
- `test` - All tests belong here
  - `preload.test.ts` - Mocks out the real DB `queryClient` for one that connects to a test DB

## API Documentation

ElysiaJS has been enhanced with the Swagger middleware to automatically generate an API reference page.
It serves the page at `http://localhost:[BACKEND_PORT]/swagger` (default: `http://localhost:3000/swagger`)

# Tests

The backend has automated unit and integration testing using the `bun test` framework. 

## Writing tests

Tests should go in the `test` directory, and be written according to the `bun test` framework ([see documenation](https://bun.sh/docs/cli/test)).

Pointers: 
- You can utilize the `db` object as if it were the actual object in production, but in reality for tests it is mocked out for a test DB. The test DB is almost entirely identical to that of the production/dev DB--the only difference is that the test DB has no real data and is wiped after restarting.
- If you need to preload stuff (primarily to globally mock out a module), add it to `preload.test.ts`, or to its own file and `bunfig.toml`
- Elysia makes integration tests really, really easy. Simply all the `app` object's (i.e. the entire Elysia listener's) `handle` method and pass it a `Request` object. Elysia will process it as if it were a real request. You can see some examples in the `api.test.ts` file.

## Running tests

Tests are run from the top level directory (i.e. `..`) by `npm run test-backend`. This will print a test report and have a non-zero error code if the tests fail. Additionally, it will print a coverage report for all files touched by tests.

NOTE: If a file is never included in a test (either directly or indirectly), it **WILL NOT** show up on the coverage report! This is an unfortunate limitation of the `bun test` framework that will hopefully be ironed out soon.