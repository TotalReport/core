import {
  initContract
} from "@ts-rest/core";
import { z } from "zod";

export const CreateAfterTestSchema = z.object({
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

export const AfterTestSchema = z.object({
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

const PatchAfterTestSchema = z.object({
  title: z.string().min(1).max(256).optional(),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().nullish(),
  finishedTimestamp: z.coerce.date().nullish(),
  statusId: z.string().nullish(),
});

const contract = initContract();

export const createAfterTest = contract.mutation({
  summary: "Create the after test.",
  method: "POST",
  path: "/v1/after-tests",
  body: CreateAfterTestSchema,
  responses: {
    201: AfterTestSchema,
  },
});

export const readAfterTest = contract.query({
  summary: "Read the after test by ID.",
  method: "GET",
  path: "/v1/after-tests/:id",
  pathParams: z.object({
    id: z.string().uuid(),
  }),
  responses: {
    201: AfterTestSchema,
    404: z.object({}),
  },
});

export const patchAfterTest = contract.mutation({
  summary: "Patch the after test fields.",
  method: "PATCH",
  path: "/v1/after-tests/:id",
  pathParams: z.object({
    id: z.string().uuid(),
  }),
  body: PatchAfterTestSchema,
  responses: {
    200: AfterTestSchema,
    404: z.object({}),
  },
});

export const deleteAfterTest = contract.mutation({
  summary: "Delete the after test by ID.",
  method: "DELETE",
  path: "/v1/after-tests/:id",
  pathParams: z.object({
    id: z.string().uuid(),
  }),
  body: contract.type<void>(),
  responses: {
    204: contract.noBody(),
    404: z.object({}),
  },
});
