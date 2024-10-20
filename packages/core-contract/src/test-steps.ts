import { initContract } from "@ts-rest/core";
import { z } from "zod";

export const CreateTestStep = z.object({
  testId: z.number().int(),
  title: z.string(),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().optional(),
  finishedTimestamp: z.coerce.date().optional(),
  isSuccessful: z.boolean().optional(),
  errorMessage: z.string().optional(),
});

export const TestStep = z.object({
  testId: z.number().int(),
  id: z.number().int(),
  title: z.string(),
  createdTimestamp: z.string().datetime({ offset: true }).optional(),
  startedTimestamp: z.string().datetime({ offset: true }).optional(),
  finishedTimestamp: z.string().datetime({ offset: true }).optional(),
  isSuccessful: z.boolean().optional(),
  errorMessage: z.string().optional(),
});

export const PatchTestStep = z.object({
  title: z.string().min(1).max(256).optional(),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().nullish(),
  finishedTimestamp: z.coerce.date().nullish(),
  isSuccessful: z.boolean().nullish(),
  errorMessage: z.string().nullish(),
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
  body: contract.type<void>(),
  responses: {
    204: contract.noBody(),
    404: z.object({}),
  },
});
