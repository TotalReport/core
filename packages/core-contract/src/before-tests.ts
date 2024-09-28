import {
  initContract
} from "@ts-rest/core";
import { z } from "zod";

export const CreateBeforeTestSchema = z.object({
  launchId: z.string().uuid(),
  testContextId: z.number().int().optional(),
  title: z.string().min(1).max(256),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().optional(),
  finishedTimestamp: z.coerce.date().optional(),
  statusId: z.string().optional(),
  arguments: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      value: z.string().nullable(),
    })
  ).optional(),
});

export const BeforeTestSchema = z.object({
  launchId: z.string().uuid(),
  testContextId: z.number().int().optional(),
  id: z.string().uuid(),
  title: z.string().min(1).max(256),
  createdTimestamp: z.string().datetime({ offset: true }),
  startedTimestamp: z.string().datetime({ offset: true }).optional(),
  finishedTimestamp: z.string().datetime({ offset: true }).optional(),
  statusId: z.string().optional(),
  argumentsHash: z.string().optional(),
  arguments: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.string(),
        value: z.string().nullable(),
      })
    )
    .optional(),
});

const PatchBeforeTestSchema = z.object({
  title: z.string().min(1).max(256).optional(),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().nullish(),
  finishedTimestamp: z.coerce.date().nullish(),
  statusId: z.string().nullish(),
});

const contract = initContract();

export const createBeforeTest = contract.mutation({
  summary: "Create the before test.",
  method: "POST",
  path: "/v1/before-tests",
  body: CreateBeforeTestSchema,
  responses: {
    201: BeforeTestSchema,
  },
});

export const readBeforeTest = contract.query({
  summary: "Read the before test by ID.",
  method: "GET",
  path: "/v1/before-tests/:id",
  pathParams: z.object({
    id: z.string().uuid(),
  }),
  responses: {
    201: BeforeTestSchema,
    404: z.object({}),
  },
});

export const patchBeforeTest = contract.mutation({
  summary: "Patch the before test fields.",
  method: "PATCH",
  path: "/v1/before-tests/:id",
  pathParams: z.object({
    id: z.string().uuid(),
  }),
  body: PatchBeforeTestSchema,
  responses: {
    200: BeforeTestSchema,
    404: z.object({}),
  },
});

export const deleteBeforeTest = contract.mutation({
  summary: "Delete the before test by ID.",
  method: "DELETE",
  path: "/v1/before-tests/:id",
  pathParams: z.object({
    id: z.string().uuid(),
  }),
  body: contract.type<void>(),
  responses: {
    204: contract.noBody(),
    404: z.object({}),
  },
});
