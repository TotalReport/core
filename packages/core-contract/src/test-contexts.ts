import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { PAGINATION_DEFAULTS } from "./defaults.js";

export const CreateTestContextSchema = z.object({
  launchId: z.number().int(),
  parentTestContextId: z.number().int().optional(),
  title: z.string().min(1).max(256),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().optional(),
  finishedTimestamp: z.coerce.date().optional(),
});

export const PatchTestContextSchema = z.object({
  title: z.string().min(1).max(256).optional(),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().nullish(),
  finishedTimestamp: z.coerce.date().nullish(),
});

export const TestContextSchema = z.object({
  launchId: z.number().int(),
  parentTestContextId: z.number().int().optional(),
  id: z.number().int(),
  title: z.string().min(1).max(256),
  createdTimestamp: z.string().datetime({ offset: true }),
  startedTimestamp: z.string().datetime({ offset: true }).optional(),
  finishedTimestamp: z.string().datetime({ offset: true }).optional(),
});

const contract = initContract();

export const createTestContext = contract.mutation({
  summary: "Create the test context.",
  method: "POST",
  path: "/v1/test-contexts",
  body: CreateTestContextSchema,
  responses: {
    201: TestContextSchema,
    400: z.object({
      message: z.string(),
    }),
  },
});

export const readTestContext = contract.query({
  summary: "Read the test context by ID.",
  method: "GET",
  path: "/v1/test-contexts/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  responses: {
    201: TestContextSchema,
    404: z.object({}),
  },
});

export const patchTestContext = contract.mutation({
  summary: "Patch the test context fields.",
  method: "PATCH",
  path: "/v1/test-contexts/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  body: PatchTestContextSchema,
  responses: {
    200: TestContextSchema,
    404: z.object({}),
  },
});

export const deleteTestContext = contract.mutation({
  summary: "Delete the test context by ID.",
  method: "DELETE",
  path: "/v1/test-contexts/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  body: contract.noBody(),
  responses: {
    204: z.void(),
    404: z.object({}),
  },
});

export const findTestContextsByLaunchId = contract.query({
  summary: "Get test contexts by launch ID. Only root level contexts are returned. Sort by start time then by creation time, nulls last.",
  method: "GET",
  path: "/v1/launches/:launchId/test-contexts",
  pathParams: z.object({
    launchId: z.coerce.number().int(),
  }),
  query: z.object({
    limit: z.coerce.number().int().optional().default(PAGINATION_DEFAULTS.limit),
    offset: z.coerce.number().int().optional().default(PAGINATION_DEFAULTS.limit),
  }),
  responses: {
    200: z.object({
      pagination: z.object({
        total: z.number().int(),
        limit: z.number().int(),
        offset: z.number().int(),
      }),
      items: z.array(TestContextSchema),
    }),
  },
});
