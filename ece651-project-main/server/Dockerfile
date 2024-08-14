FROM oven/bun as base

ARG LOG_LEVEL
WORKDIR /app

ADD package.json ./
ADD tsconfig.json ./

EXPOSE 3000
ENV LOG_LEVEL ${LOG_LEVEL}

# DEVELOPMENT
FROM base as dev
CMD ["bun", "run", "dev", "|", "bunx", "pino-pretty", "--colorize"]

RUN bun install
COPY . .

ENV NODE_ENV development

# PRODUCTION
FROM base as prod
CMD ["bun", "src/index.ts", "|", "bunx", "pino-pretty", "--colorize"]

ADD bun.lockb ./
RUN bun install --production
COPY . .

ENV NODE_ENV production

FROM base as test
CMD [ "bun", "test", "--timeout", "20000" ]

RUN bun install
COPY . .

ENV NODE_ENV development
