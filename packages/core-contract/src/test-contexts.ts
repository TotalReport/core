import { initContract } from "@ts-rest/core";
import { z } from "zod";

export const CreateTestContext = z.object({
  launchId: z.string().uuid(),
  title: z.string(),
  createdTimestamp: z.string().optional(),
  startedTimestamp: z.string().optional(),
  finishedTimestamp: z.string().optional()
});

export const TestContext = z.object({
  id: z.number().int(),
  title: z.string(),
  launchId: z.string().uuid(),
  createdTimestamp: z.string(),
  startedTimestamp: z.string().optional(),
  finishedTimestamp: z.string().optional()
});

export const createTestContext = initContract().mutation({
  summary: "Create the test context.",
  method: "POST",
  path: "/v1/test-ciontexts",
  body: CreateTestContext,
  responses: {
    201: TestContext,
  },
});
