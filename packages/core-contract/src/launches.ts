import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { initContract } from "@ts-rest/core";
import { z } from "zod";

extendZodWithOpenApi(z);

export const CreateLaunchSchema = z.object({
  reportId: z.number().int(),
  title: z.string().min(1).max(256),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().optional(),
  finishedTimestamp: z.coerce.date().optional(),
});

export const PatchLaunchSchema = z.object({
  title: z.string().min(1).max(256).optional(),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().nullish(),
  finishedTimestamp: z.coerce.date().nullish(),
});

export const LaunchSchema = z.object({
  reportId: z.number().int(),
  id: z.number().int(),
  title: z.string().min(1).max(256),
  createdTimestamp: z.string().datetime({ offset: true }),
  startedTimestamp: z.string().datetime({ offset: true }).optional(),
  finishedTimestamp: z.string().datetime({ offset: true }).optional(),
});

const launchesContract = initContract();

export const createLaunch = launchesContract.mutation({
  summary: "Create the launch.",
  method: "POST",
  path: "/v1/launches",
  body: CreateLaunchSchema,
  responses: {
    201: LaunchSchema,
  },
});

export const readLaunch = launchesContract.query({
  summary: "Read the launch by ID.",
  method: "GET",
  path: "/v1/launches/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  responses: {
    201: LaunchSchema,
    404: z.object({}),
  },
});

export const patchLaunch = launchesContract.mutation({
  summary: "Patch the launch fields.",
  method: "PATCH",
  path: "/v1/launches/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  body: PatchLaunchSchema,
  responses: {
    200: LaunchSchema,
    404: z.object({}),
  },
});

export const deleteLaunch = launchesContract.mutation({
  summary: "Delete the launch by ID.",
  method: "DELETE",
  path: "/v1/launches/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  body: launchesContract.type<void>(),
  responses: {
    204: launchesContract.noBody(),
    404: z.object({}),
  },
});
