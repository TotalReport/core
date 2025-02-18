import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { PAGINATION_DEFAULTS } from "./defaults.js";

export const CreateTestSchema = z.object({
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
      "The correlation ID is used together with arguments hash to identify the tests suitable for compare." +
        " If the correlation ID is not provided, it will be generated from the title."
    ),
  argumentsHash: z
    .string()
    .optional()
    .describe(
      "The hash of the arguments. Together with the correlation ID, it is used to identify the tests suitable for compare." +
        " If the arguments hash is not provided, it will be generated from the arguments."
    ),
});

export const TestSchema = z.object({
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

export const PatchTestSchema = z.object({
  title: z.string().min(1).max(256).optional(),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().nullish(),
  finishedTimestamp: z.coerce.date().nullish(),
  statusId: z.string().nullish(),
});

const contract = initContract();

export const createTest = contract.mutation({
  summary: "Create the test.",
  method: "POST",
  path: "/v1/tests",
  body: CreateTestSchema,
  responses: {
    201: TestSchema,
  },
});

export const readTest = contract.query({
  summary: "Read the test by ID.",
  method: "GET",
  path: "/v1/tests/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  responses: {
    201: TestSchema,
    404: z.object({}),
  },
});

export const findTests = contract.query({
  summary: "Find the tests.",
  method: "GET",
  path: "/v1/tests",
  query: z.object({
    reportId: z.coerce
      .number()
      .int()
      .optional()
      .describe("The report ID the tests belong to."),
    launchId: z.coerce
      .number()
      .int()
      .optional()
      .describe("The launch ID the tests belong to."),
    testContextId: z.coerce
      .number()
      .int()
      .optional()
      .describe("The test context ID the tests belong to."),
    correlationId: z.coerce
      .string()
      .uuid()
      .optional()
      .describe("The correlation ID the tests have."),
    argumentsHash: z.coerce
      .string()
      .optional()
      .describe("The arguments hash the tests have."),
    limit: z.coerce
      .number()
      .int()
      .optional()
      .default(PAGINATION_DEFAULTS.limit)
      .describe("The number of items to return."),
    offset: z.coerce
      .number()
      .int()
      .optional()
      .default(PAGINATION_DEFAULTS.limit)
      .describe("The number of items to skip."),
  }),
  responses: {
    200: z.object({
      pagination: z.object({
        total: z.number().int(),
        limit: z.number().int(),
        offset: z.number().int(),
      }),
      items: z.array(TestSchema)
    }),
  },
});

export const patchTest = contract.mutation({
  summary: "Patch the test fields.",
  method: "PATCH",
  path: "/v1/tests/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  body: PatchTestSchema,
  responses: {
    200: TestSchema,
    404: z.object({}),
  },
});

export const deleteTest = contract.mutation({
  summary: "Delete the test by ID.",
  method: "DELETE",
  path: "/v1/tests/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  body: contract.noBody(),
  responses: {
    204: z.void(),
    404: z.object({}),
  },
});
