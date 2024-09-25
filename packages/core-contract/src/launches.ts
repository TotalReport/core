import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { initContract } from "@ts-rest/core";
import { z } from "zod";

extendZodWithOpenApi(z);

const LaunchSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdTimestamp: z.string(),
  startedTimestamp: z.string().nullable(),
  finishedTimestamp: z.string().nullable(),
  reportId: z.string().uuid(),
});

const launchesContract = initContract();

export const createLaunch = launchesContract.mutation({
  method: "POST",
  path: "/v1/launches",
  responses: {
    201: LaunchSchema,
  },
  body: z.object({
    reportId: z.string().uuid(),
    title: z.string(),
  }),
  summary: "Create the launch.",
});

export const readLaunch = launchesContract.query({
  method: "GET",
  path: "/v1/launches/:id",
  pathParams: z.object({
    id: z.string().uuid(),
  }),
  responses: {
    201: LaunchSchema,
    404: z.object({}),
  },
  summary: "Read the launch by ID.",
});

export const deleteLaunch = launchesContract.mutation({
  method: "DELETE",
  path: "/v1/launches/:id",
  pathParams: z.object({
    id: z.string().uuid(),
  }),
  responses: {
    204: launchesContract.type<void>(),
    404: z.object({}),
  },
  body: launchesContract.type<void>(),
});

export const updateLaunchStarted = launchesContract.mutation({
  summary: "Update the launch started timestamp.",
  method: "PATCH",
  path: "/v1/launches/:id/started",
  pathParams: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    startedTimestamp: z.string().datetime({ offset: true }).nullish(),
  }),
  responses: {
    200: LaunchSchema,
    404: z.object({}),
  },
});

export const updateLaunchFinished = launchesContract.mutation({
  summary: "Update the launch finished timestamp.",
  method: "PATCH",
  path: "/v1/launches/:id/finished",
  pathParams: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    finishedTimestamp: z.string().datetime({ offset: true }).nullish(),
  }),
  responses: {
    200: LaunchSchema,
    404: z.object({}),
  },
});
