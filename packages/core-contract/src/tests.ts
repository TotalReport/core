import { initContract } from "@ts-rest/core";
import { z } from "zod";

export const CreateTestSchema = z.object({
  launchId: z.number().int(),
  testContextId: z.number().int().optional(),
  title: z.string().min(1).max(256),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().optional(),
  finishedTimestamp: z.coerce.date().optional(),
  statusId: z.string().optional(),
  arguments: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        value: z.string().nullable(),
      })
    )
    .optional(),
});

export const TestSchema = z.object({
  launchId: z.number().int(),
  testContextId: z.number().int().optional(),
  id: z.number().int(),
  title: z.string().min(1).max(256),
  createdTimestamp: z.string().datetime({ offset: true }),
  startedTimestamp: z.string().datetime({ offset: true }).optional(),
  finishedTimestamp: z.string().datetime({ offset: true }).optional(),
  statusId: z.string().optional(),
  argumentsHash: z.string().optional(),
  arguments: z
    .array(
      z.object({
        id: z.number().int(),
        name: z.string(),
        type: z.string(),
        value: z.string().nullable(),
      })
    )
    .optional(),
});

const PatchTestSchema = z.object({
  title: z.string().min(1).max(256).optional(),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().nullish(),
  finishedTimestamp: z.coerce.date().nullish(),
  statusId: z.string().nullish(),
});

const contract = initContract();

export const createTest = contract.mutation({
  summary: "Create the test.",
  method: "POST",
  path: "/v1/tests",
  body: CreateTestSchema,
  responses: {
    201: TestSchema,
  },
});

export const readTest = contract.query({
  summary: "Read the test by ID.",
  method: "GET",
  path: "/v1/tests/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  responses: {
    201: TestSchema,
    404: z.object({}),
  },
});

export const patchTest = contract.mutation({
  summary: "Patch the test fields.",
  method: "PATCH",
  path: "/v1/tests/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  body: PatchTestSchema,
  responses: {
    200: TestSchema,
    404: z.object({}),
  },
});

export const deleteTest = contract.mutation({
  summary: "Delete the test by ID.",
  method: "DELETE",
  path: "/v1/tests/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  body: contract.type<void>(),
  responses: {
    204: contract.noBody(),
    404: z.object({}),
  },
});
