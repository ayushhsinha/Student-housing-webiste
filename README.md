# Project Structure

- `client` - Contains all frontend logic and Angular code
- `server` - Contains backend using the ElysiaJS

# Running the Project

Ensure you have the following programs installed:

- Docker/Docker Compose
- Python 3 (>3.7)
- Bun
- Node.js/NPM

## Environment Setup

The front and backend rely on constants, some of which are in `.env` files, and some of which are in the `shared` directory.

To build these constants, follow these steps:

1. Run `npm run input-env`. This will prompt you to enter some env variables (e.g. port numbers). If you're not sure, keep them as default by providing an empty line.
2. Run `npm run generate-constants`. This copies the `.env` files to their respective locations and generates a `shared_constants.json` in the `shared` directory.

If you ever need to regenerate constants, just run step 2 again.

### Adding New Constants

Refer to the README.md in the `env-builder` folder

### Starting Containers

Once you have the environment set up, you can run the containers in either dev or prod mode.

Currently the primary difference between Dev and Prod is that the former has hot reloading enabled for both the front and back-end.

## Dev

Run the containers in the following order:

1. Run the DB container

```
npm run db-up
```

2. Push the Drizzle schema to the DB if any changes to the schema have occured

```
npm run db-push
```

3. Start the front and backend

```
npm run dev
```

When you're done and want to take down the db, run

```
npm run db-down
```

## Prod

```
npm run prod
```

# Tests

Currently the project supports running tests for the backend in Docker Containers. See the README.md in the `server` directory for more details.
