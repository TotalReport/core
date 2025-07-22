import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { PAGINATION_DEFAULTS } from "./defaults.js";
import { zBoolean } from "./utils/z-types.js";

extendZodWithOpenApi(z);

const contract = initContract();

export const TestEntitySchema = z.object({
  launchId: z.number().int(),
  parentContextId: z.number().int().optional(),
  id: z.number().int(),
  entityType: z.string(),
  title: z.string(),
  createdTimestamp: z.string(),
  startedTimestamp: z.string().optional(),
  finishedTimestamp: z.string().optional(),
  statusId: z.string().optional(),
  correlationId: z.string(),
  argumentsHash: z.string(),
  externalArgumentsHash: z.string(),
});

export const findTestEntities = contract.query({
  summary:
    "Find test entities. Test entities are before tests, tests, after tests.",
  method: "GET",
  path: "/v1/test-entities",
  query: z.object({
    "title~cnt": z
      .string()
      .optional()
      .describe("The title of the test entity contains the string."),
    entityTypes: z
      .array(z.enum(["beforeTest", "test", "afterTest"]))
      .optional(),
    reportId: z.coerce.number().int().optional(),
    launchId: z.coerce.number().int().optional(),
    contextId: z.coerce.number().int().optional(),
    correlationId: z.coerce.string().optional(),
    argumentsHash: z.coerce.string().optional(),
    externalArgumentsHash: z.coerce.string().optional(),
    distinct: zBoolean(z).default("false"),
    limit: z.coerce
      .number()
      .int()
      .optional()
      .default(PAGINATION_DEFAULTS.limit),
    offset: z.coerce
      .number()
      .int()
      .optional()
      .default(PAGINATION_DEFAULTS.offset),
  }),
  responses: {
    200: z.object({
      pagination: z.object({
        total: z.number().int(),
        limit: z.number().int(),
        offset: z.number().int(),
      }),
      items: z.array(TestEntitySchema),
    }),
  },
});

export const StatusesCountsSchema = z.array(
  z.object({
    entityType: z.enum(["beforeTest", "test", "afterTest"]),
    statusId: z.string().nullable(),
    count: z.number().int(),
  })
);

export const findTestEntitiesCountsByStatuses = contract.query({
  summary:
    "Get the test entities counts grouped by status and test entity type.",
  method: "GET",
  path: "/v1/test-entities/counts/statuses",
  query: z.object({
    reportId: z.coerce.number().int().optional(),
    launchId: z.coerce.number().int().optional(),
    distinct: zBoolean(z),
  }),
  responses: {
    200: StatusesCountsSchema,
    404: z.object({}),
  },
});
