import { initContract } from "@ts-rest/core";
import { z } from "zod";

export const CreateAfterTestStep = z.object({
  afterTestId: z.number().int(),
  title: z.string(),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().optional(),
  finishedTimestamp: z.coerce.date().optional(),
  isSuccessful: z.boolean().optional(),
  errorMessage: z.string().optional(),
});

export const AfterTestStep = z.object({
  afterTestId: z.number().int(),
  id: z.number().int(),
  title: z.string(),
  createdTimestamp: z.string().datetime({ offset: true }).optional(),
  startedTimestamp: z.string().datetime({ offset: true }).optional(),
  finishedTimestamp: z.string().datetime({ offset: true }).optional(),
  isSuccessful: z.boolean().optional(),
  errorMessage: z.string().optional(),
});

export const PatchAfterTestStep = z.object({
  title: z.string().min(1).max(256).optional(),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().nullish(),
  finishedTimestamp: z.coerce.date().nullish(),
  isSuccessful: z.boolean().nullish(),
  errorMessage: z.string().nullish(),
});

const contract = initContract();

export const createAfterTestStep = contract.mutation({
  summary: "Create the after test step.",
  method: "POST",
  path: "/v1/after-test-steps",
  body: CreateAfterTestStep,
  responses: {
    201: AfterTestStep,
  },
});

export const readAfterTestStep = contract.query({
  summary: "Get the after test step by ID.",
  method: "GET",
  path: "/v1/after-test-steps/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  responses: {
    200: AfterTestStep,
  },
});

export const patchAfterTestStep = contract.mutation({
  summary: "Patch the after test step fields.",
  method: "PATCH",
  path: "/v1/after-test-steps/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  body: PatchAfterTestStep,
  responses: {
    200: AfterTestStep,
    404: z.object({}),
  },
});

export const deleteAfterTestStep = contract.mutation({
  summary: "Delete the after test step by ID.",
  method: "DELETE",
  path: "/v1/after-test-steps/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  body: contract.noBody(),
  responses: {
    204: z.void(),
    404: z.object({}),
  },
});
