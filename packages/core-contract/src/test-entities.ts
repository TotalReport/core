import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { PAGINATION_DEFAULTS } from "./defaults.js";

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
  correlationId: z.string().optional(),
  argumentsHash: z.string().optional(),
});

export const findTestEntities = contract.query({
  summary:
    "Find test entities. Test entities are before tests, tests, after tests.",
  method: "GET",
  path: "/v1/test-entities",
  query: z.object({
    entityTypes: z
      .array(z.enum(["before test", "test", "after test"]))
      .optional(),
    reportId: z.coerce.number().int().optional(),
    launchId: z.coerce.number().int().optional(),
    contextId: z.coerce.number().int().optional(),
    correlationId: z.coerce.string().optional(),
    argumentsHash: z.coerce.string().optional(),
    distinct: z.coerce.boolean().optional().default(false),
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
