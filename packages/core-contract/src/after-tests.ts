import {
  initContract
} from "@ts-rest/core";
import { z } from "zod";

export const CreateAfterTestSchema = z.object({
  launchId: z.string().uuid(),
  testContextId: z.number().int().optional(),
  title: z.string(),
  createdTimestamp: z.string().optional(),
  startedTimestamp: z.string().optional(),
  finishedTimestamp: z.string().optional(),
  statusId: z.string().optional(),
  arguments: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      value: z.string().nullable(),
    })
  ).optional(),
});

export const AfterTestSchema = z.object({
  launchId: z.string().uuid(),
  testContextId: z.number().int().optional(),
  id: z.string(),
  title: z.string(),
  createdTimestamp: z.string(),
  startedTimestamp: z.string().optional(),
  finishedTimestamp: z.string().optional(),
  statusId: z.string().optional(),
  argumentsHash: z.string().optional(),
  arguments: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.string(),
        value: z.string().nullable(),
      })
    )
    .optional(),
});

export const createAfterTest = initContract().mutation({
  summary: "Create the after test.",
  method: "POST",
  path: "/v1/after-tests",
  body: CreateAfterTestSchema,
  responses: {
    201: AfterTestSchema,
  },
});
