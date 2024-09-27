import {
  initContract
} from "@ts-rest/core";
import { z } from "zod";

export const CreateBeforeTestSchema = z.object({
  launchId: z.string().uuid(),
  testContextId: z.number().int().optional(),
  title: z.string(),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().optional(),
  finishedTimestamp: z.coerce.date().optional(),
  statusId: z.string().optional(),
  arguments: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      value: z.string().nullable(),
    })
  ).optional(),
});

export const BeforeTestSchema = z.object({
  launchId: z.string().uuid(),
  testContextId: z.number().int().optional(),
  id: z.string().uuid(),
  title: z.string(),
  createdTimestamp: z.string().datetime({ offset: true }),
  startedTimestamp: z.string().datetime({ offset: true }).optional(),
  finishedTimestamp: z.string().datetime({ offset: true }).optional(),
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

const contract = initContract();

export const createBeforeTest = contract.mutation({
  summary: "Create the before test.",
  method: "POST",
  path: "/v1/before-tests",
  body: CreateBeforeTestSchema,
  responses: {
    201: BeforeTestSchema,
  },
});

export const readBeforeTest = contract.query({
  summary: "Read the before test by ID.",
  method: "GET",
  path: "/v1/before-tests/:id",
  pathParams: z.object({
    id: z.string().uuid(),
  }),
  responses: {
    201: BeforeTestSchema,
    404: z.object({}),
  },
});
