import { initContract } from "@ts-rest/core";
import { z } from "zod";

export const CreateTestSchema = z.object({
  launchId: z.string().uuid(),
  testContextId: z.number().int().optional(),
  title: z.string(),
  createdTimestamp: z.string().optional(),
  startedTimestamp: z.string().optional(),
  finishedTimestamp: z.string().optional(),
  before: z.array(z.string().uuid()).optional(),
  statusId: z.string().optional(),
  arguments: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      value: z.string().nullable(),
    })
  ),
});

export const TestSchema = z.object({
  id: z.string(),
  title: z.string(),
  launchId: z.string().uuid(),
  testContextId: z.number().int().optional(),
  createdTimestamp: z.string(),
  startedTimestamp: z.string().optional(),
  finishedTimestamp: z.string().optional(),
  statusId: z.string().optional(),
  argumentsHash: z.string().nullable(),
  arguments: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.string(),
        value: z.string().nullable(),
      })
    )
    .nullable(),
});

export const createTest = initContract().mutation({
  summary: "Create the test.",
  method: "POST",
  path: "/v1/tests",
  body: CreateTestSchema,
  responses: {
    201: TestSchema,
  },
});
