import { initContract } from "@ts-rest/core";
import { z } from "zod";

export const CreateAfterTestStep = z.object({
  afterTestId: z.string().uuid(),
  title: z.string(),
  createdTimestamp: z.string().optional(),
  startedTimestamp: z.string().optional(),
  finishedTimestamp: z.string().optional(),
  isSuccessful: z.boolean().optional(),
  errorMessage: z.string().optional()
});

export const AfterTestStep = z.object({
  afterTestId: z.string().uuid(),
  id: z.number().int(),
  title: z.string(),
  createdTimestamp: z.string().optional(),
  startedTimestamp: z.string().optional(),
  finishedTimestamp: z.string().optional(),
  isSuccessful: z.boolean().optional(),
  errorMessage: z.string().optional()
});

export const createAfterTestStep = initContract().mutation({
  summary: "Create the after test step.",
  method: "POST",
  path: "/v1/after-test-steps",
  body: CreateAfterTestStep,
  responses: {
    201: AfterTestStep,
  },
});
