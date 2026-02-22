import { initContract } from "@ts-rest/core";
import { z } from "zod";

export const CreateTestStep = z.object({
  testId: z.number().int(),
  title: z.string(),
  startedTimestamp: z.coerce.date(),
  finishedTimestamp: z.coerce.date().optional(),
  isSuccessful: z.boolean().optional(),
  errorMessage: z.string().optional(),
  thread: z.string().max(256).optional(),
  process: z.string().max(256).optional(),
});

export const TestStep = z.object({
  testId: z.number().int(),
  id: z.number().int(),
  title: z.string(),
  startedTimestamp: z.string().datetime({ offset: true }),
  finishedTimestamp: z.string().datetime({ offset: true }).optional(),
  isSuccessful: z.boolean().optional(),
  errorMessage: z.string().optional(),
  thread: z.string().max(256).optional(),
  process: z.string().max(256).optional(),
});

export const PatchTestStep = z.object({
  title: z.string().min(1).max(256).optional(),
  startedTimestamp: z.coerce.date().optional(),
  finishedTimestamp: z.coerce.date().nullish(),
  isSuccessful: z.boolean().nullish(),
  errorMessage: z.string().nullish(),
  thread: z.string().max(256).nullish(),
  process: z.string().max(256).nullish(),
});

const contract = initContract();

export const createTestStep = contract.mutation({
  summary: "Create the test step.",
  method: "POST",
  path: "/v1/test-steps",
  body: CreateTestStep,
  responses: {
    201: TestStep,
  },
});

export const readTestStep = contract.query({
  summary: "Get the test step by ID.",
  method: "GET",
  path: "/v1/test-steps/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  responses: {
    200: TestStep,
  },
});

export const findTestSteps = contract.query({
  summary: "Find test steps.",
  method: "GET",
  path: "/v1/test-steps",
  query: z.object({
    testId: z.coerce.number().int().describe("Filter by test ID"),
  }),
  responses: {
    200: z.array(TestStep),
  },
});

export const patchTestStep = contract.mutation({
  summary: "Patch the test step fields.",
  method: "PATCH",
  path: "/v1/test-steps/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  body: PatchTestStep,
  responses: {
    200: TestStep,
    404: z.object({}),
  },
});

export const deleteTestStep = contract.mutation({
  summary: "Delete the test step by ID.",
  method: "DELETE",
  path: "/v1/test-steps/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  body: contract.noBody(),
  responses: {
    204: z.void(),
    404: z.object({}),
  },
});
