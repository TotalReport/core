import { initContract } from "@ts-rest/core";
import { z } from "zod";

export const CreateAfterTestSchema = z.object({
  launchId: z.number().int(),
  testContextId: z.number().int().optional(),
  title: z.string().min(1).max(256),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().optional(),
  finishedTimestamp: z.coerce.date().optional(),
  statusId: z.string().optional(),
  arguments: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        value: z.string().nullable(),
      })
    )
    .optional(),
  correlationId: z
    .string()
    .uuid()
    .optional()
    .describe(
      "The correlation ID is used together with arguments hash to identify the after tests suitable for compare." +
        " If the correlation ID is not provided, it will be generated from the title."
    ),
  argumentsHash: z
    .string()
    .optional()
    .describe(
      "The hash of the arguments. Together with the correlation ID, it is used to identify the after tests suitable for compare." +
        " If the arguments hash is not provided, it will be generated from the arguments."
    ),
});

export const AfterTestSchema = z.object({
  launchId: z.number().int(),
  testContextId: z.number().int().optional(),
  id: z.number().int(),
  title: z.string().min(1).max(256),
  createdTimestamp: z.string().datetime({ offset: true }),
  startedTimestamp: z.string().datetime({ offset: true }).optional(),
  finishedTimestamp: z.string().datetime({ offset: true }).optional(),
  statusId: z.string().optional(),
  arguments: z
    .array(
      z.object({
        id: z.number().int(),
        name: z.string(),
        type: z.string(),
        value: z.string().nullable(),
      })
    )
    .optional(),
  correlationId: z.string().uuid(),
  argumentsHash: z.string().uuid(),
});

export const PatchAfterTestSchema = z.object({
  title: z.string().min(1).max(256).optional(),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().nullish(),
  finishedTimestamp: z.coerce.date().nullish(),
  statusId: z.string().nullish(),
});

const contract = initContract();

export const createAfterTest = contract.mutation({
  summary: "Create the after test.",
  method: "POST",
  path: "/v1/after-tests",
  body: CreateAfterTestSchema,
  responses: {
    201: AfterTestSchema,
  },
});

export const readAfterTest = contract.query({
  summary: "Read the after test by ID.",
  method: "GET",
  path: "/v1/after-tests/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  responses: {
    200: AfterTestSchema,
    404: z.object({}),
  },
});

export const patchAfterTest = contract.mutation({
  summary: "Patch the after test fields.",
  method: "PATCH",
  path: "/v1/after-tests/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  body: PatchAfterTestSchema,
  responses: {
    200: AfterTestSchema,
    404: z.object({}),
  },
});

export const deleteAfterTest = contract.mutation({
  summary: "Delete the after test by ID.",
  method: "DELETE",
  path: "/v1/after-tests/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  body: contract.noBody(),
  responses: {
    204: z.void(),
    404: z.object({}),
  },
});
