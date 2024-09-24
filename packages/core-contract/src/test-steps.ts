import { initContract } from "@ts-rest/core";
import { z } from "zod";

export const CreateTestStep = z.object({
  testId: z.string().uuid(),
  title: z.string(),
  createdTimestamp: z.string().optional(),
  startedTimestamp: z.string().optional(),
  finishedTimestamp: z.string().optional(),
  isSuccessful: z.boolean().optional(),
  errorMessage: z.string().optional(),
});

export const TestStep = z.object({
  testId: z.string().uuid(),
  id: z.number().int(),
  title: z.string(),
  createdTimestamp: z.string().optional(),
  startedTimestamp: z.string().optional(),
  finishedTimestamp: z.string().optional(),
  isSuccessful: z.boolean().optional(),
  errorMessage: z.string().optional(),
});

export const createTestStep = initContract().mutation({
  summary: "Create the test step.",
  method: "POST",
  path: "/v1/test-steps",
  body: CreateTestStep,
  responses: {
    201: TestStep,
  },
});
