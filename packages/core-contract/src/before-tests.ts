import {
  initContract
} from "@ts-rest/core";
import { z } from "zod";

export const CreateBeforeTestSchema = z.object({
  title: z.string(),
  createdTimestamp: z.string(),
  startedTimestamp: z.string().nullable(),
  finishedTimestamp: z.string().nullable(),
  launchId: z.string().uuid(),
  statusId: z.string().nullable(),
  arguments: z.array(
    z
      .object({
        name: z.string(),
        value: z.string(),
      })
      .nullable()
  ),
});

export const BeforeTestSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdTimestamp: z.string(),
  startedTimestamp: z.string().optional(),
  finishedTimestamp: z.string().optional(),
  launchId: z.string().uuid(),
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

export const createBeforeTest = initContract().mutation({
  summary: "Create the before test.",
  method: "POST",
  path: "/v1/before-tests",
  body: z.object({
    launchId: z.string().uuid(),
    title: z.string(),
    createdTimestamp: z.string().optional(),
    startedTimestamp: z.string().optional(),
    finishedTimestamp: z.string().optional(),
    statusId: z.string().optional(),
    arguments: z.array(
      z
        .object({
          name: z.string(),
          type: z.string(),
          value: z.string().nullable(),
        })
    ),
  }),
  responses: {
    201: BeforeTestSchema,
  },
});
