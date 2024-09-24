import { initContract } from "@ts-rest/core";
import { z } from "zod";

export const CreateBeforeTestStep = z.object({
  beforeTestId: z.string().uuid(),
  title: z.string(),
  createdTimestamp: z.string().optional(),
  startedTimestamp: z.string().optional(),
  finishedTimestamp: z.string().optional(),
  isSuccessful: z.boolean().optional(),
  errorMessage: z.string().optional()
});

export const BeforeTestStep = z.object({
  beforeTestId: z.string().uuid(),
  id: z.number().int(),
  title: z.string(),
  createdTimestamp: z.string().optional(),
  startedTimestamp: z.string().optional(),
  finishedTimestamp: z.string().optional(),
  isSuccessful: z.boolean().optional(),
  errorMessage: z.string().optional()
});

export const createBeforeTestStep = initContract().mutation({
  summary: "Create the before test step.",
  method: "POST",
  path: "/v1/before-test-steps",
  body: CreateBeforeTestStep,
  responses: {
    201: BeforeTestStep,
  },
});
