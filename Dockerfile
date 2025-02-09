FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app

# Next line is the workaround for the issue https://github.com/nodejs/corepack/issues/612
RUN corepack prepare pnpm@10.0.0 --activate

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter "@total-report/core-service" run build
RUN pnpm --filter "@total-report/core-schema-migrator" run build
# RUN pnpm run -r build
RUN pnpm deploy --filter=core-schema-migrator --prod /prod/total-report-core-schema-migrator
RUN pnpm deploy --filter=core-service --prod /prod/total-report-core-service

FROM base AS total-report-core-schema-migrator

# Next line is the workaround for the issue https://github.com/nodejs/corepack/issues/612
RUN corepack prepare pnpm@10.0.0 --activate

COPY --from=build /prod/total-report-core-schema-migrator /prod/total-report-core-schema-migrator
WORKDIR /prod/total-report-core-schema-migrator
CMD [ "pnpm", "migrate" ]

FROM base AS total-report-core-service

# Next line is the workaround for the issue https://github.com/nodejs/corepack/issues/612
RUN corepack prepare pnpm@10.0.0 --activate

COPY --from=build /prod/total-report-core-service /prod/total-report-core-service
WORKDIR /prod/total-report-core-service
HEALTHCHECK --interval=10s --timeout=1s --start-period=5s CMD ["node", "./dist/healthcheck.js"]
CMD [ "pnpm", "start" ]