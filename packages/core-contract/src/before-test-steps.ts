import { initContract } from "@ts-rest/core";
import { z } from "zod";

export const CreateBeforeTestStep = z.object({
  beforeTestId: z.string().uuid(),
  title: z.string(),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().optional(),
  finishedTimestamp: z.coerce.date().optional(),
  isSuccessful: z.boolean().optional(),
  errorMessage: z.string().optional(),
});

export const BeforeTestStep = z.object({
  beforeTestId: z.string().uuid(),
  id: z.number().int(),
  title: z.string(),
  createdTimestamp: z.string().datetime({ offset: true }).optional(),
  startedTimestamp: z.string().datetime({ offset: true }).optional(),
  finishedTimestamp: z.string().datetime({ offset: true }).optional(),
  isSuccessful: z.boolean().optional(),
  errorMessage: z.string().optional(),
});

const PatchBeforeTestStep = z.object({
  title: z.string().min(1).max(256).optional(),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().nullish(),
  finishedTimestamp: z.coerce.date().nullish(),
  isSuccessful: z.boolean().nullish(),
  errorMessage: z.string().nullish(),
});

const contract = initContract();

export const createBeforeTestStep = contract.mutation({
  summary: "Create the before test step.",
  method: "POST",
  path: "/v1/before-test-steps",
  body: CreateBeforeTestStep,
  responses: {
    201: BeforeTestStep,
  },
});

export const readBeforeTestStep = contract.query({
  summary: "Get the before test step by ID.",
  method: "GET",
  path: "/v1/before-test-steps/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  responses: {
    200: BeforeTestStep,
  },
});

export const patchBeforeTestStep = contract.mutation({
  summary: "Patch the before test step fields.",
  method: "PATCH",
  path: "/v1/before-tests-steps/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  body: PatchBeforeTestStep,
  responses: {
    200: BeforeTestStep,
    404: z.object({}),
  },
});
