import { initContract } from "@ts-rest/core";
import { z } from "zod";

export const CreateTestContextSchema = z.object({
  launchId: z.string().uuid(),
  parentTestContextId: z.number().int().optional(),
  title: z.string().min(1).max(256),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().optional(),
  finishedTimestamp: z.coerce.date().optional()
});

export const PatchTestContextSchema = z.object({
  title: z.string().min(1).max(256).optional(),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().nullish(),
  finishedTimestamp: z.coerce.date().nullish()
});

export const TestContextSchema = z.object({
  launchId: z.string().uuid(),
  parentTestContextId: z.number().int().optional(),
  id: z.number().int(),
  title: z.string().min(1).max(256),
  createdTimestamp: z.string().datetime({ offset: true }),
  startedTimestamp: z.string().datetime({ offset: true }).optional(),
  finishedTimestamp: z.string().datetime({ offset: true }).optional()
});

const testContextContract = initContract();

export const createTestContext = testContextContract.mutation({
  summary: "Create the test context.",
  method: "POST",
  path: "/v1/test-contexts",
  body: CreateTestContextSchema,
  responses: {
    201: TestContextSchema,
  },
});

export const readTestContext = testContextContract.query({
  summary: "Read the test context by ID.",
  method: "GET",
  path: "/v1/test-contexts/:id",
  pathParams: z.object({
    id: z.string().uuid(),
  }),
  responses: {
    201: TestContextSchema,
    404: z.object({}),
  },
});

export const patchTestContext = testContextContract.mutation({
  summary: "Patch the test context fields.",
  method: "PATCH",
  path: "/v1/test-contexts/:id",
  pathParams: z.object({
    id: z.string().uuid(),
  }),
  body: PatchTestContextSchema,
  responses: {
    200: TestContextSchema,
    404: z.object({}),
  },
});

export const deleteTestContext = testContextContract.mutation({
  summary: "Delete the test context by ID.",
  method: "DELETE",
  path: "/v1/test-contexts/:id",
  pathParams: z.object({
    id: z.string().uuid(),
  }),
  body: testContextContract.type<void>(),
  responses: {
    204: testContextContract.noBody(),
    404: z.object({}),
  },
});
