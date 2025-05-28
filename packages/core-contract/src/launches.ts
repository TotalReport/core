import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { PAGINATION_DEFAULTS } from "./defaults.js";

extendZodWithOpenApi(z);

export const CreateLaunchSchema = z.object({
  reportId: z.number().int(),
  title: z.string().min(1).max(256),
  correlationId: z
    .string()
    .uuid()
    .optional()
    .describe(
      "The correlation ID is used together with arguments hash to identify the runs suitable for compare." +
        " If the correlation ID is not provided, it will be generated from the title."
    ),
  arguments: z
    .string()
    .optional()
    .describe("The arguments which were used to start the run."),
  argumentsHash: z
    .string()
    .optional()
    .describe(
      "The hash of the arguments. Together with the correlation ID, it is used to identify the runs suitable for compare." +
        " If the arguments hash is not provided, it will be generated from the arguments."
    ),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().optional(),
  finishedTimestamp: z.coerce.date().optional(),
});

export const PatchLaunchSchema = z.object({
  title: z.string().min(1).max(256).optional(),
  createdTimestamp: z.coerce.date().optional(),
  startedTimestamp: z.coerce.date().nullish(),
  finishedTimestamp: z.coerce.date().nullish(),
});

export const LaunchSchema = z.object({
  reportId: z.number().int(),
  id: z.number().int(),
  title: z.string().min(1).max(256),
  createdTimestamp: z.string().datetime({ offset: true }),
  startedTimestamp: z.string().datetime({ offset: true }).optional(),
  finishedTimestamp: z.string().datetime({ offset: true }).optional(),
  correlationId: z.string().uuid(),
  arguments: z.string().optional(),
  argumentsHash: z.string(),
});

const contract = initContract();

export const createLaunch = contract.mutation({
  summary: "Create the launch.",
  method: "POST",
  path: "/v1/launches",
  body: CreateLaunchSchema,
  responses: {
    201: LaunchSchema,
  },
});

export const readLaunch = contract.query({
  summary: "Read the launch by ID.",
  method: "GET",
  path: "/v1/launches/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  responses: {
    200: LaunchSchema,
    404: z.object({}),
  },
});

export const findLaunches = contract.query({
  summary: "Find the launches.",
  method: "GET",
  path: "/v1/launches",
  query: z.object({
    limit: z.coerce
      .number()
      .int()
      .optional()
      .default(PAGINATION_DEFAULTS.limit),
    offset: z.coerce
      .number()
      .int()
      .optional()
      .default(PAGINATION_DEFAULTS.limit),
    reportId: z.coerce.number().int().optional(),
    correlationId: z.string().uuid().optional(),
    argumentsHash: z.string().optional(),
    "title~cnt": z.string().optional().describe("Search by substring in the title."),
  }),
  responses: {
    200: z.object({
      pagination: z.object({
        total: z.number().int(),
        limit: z.number().int(),
        offset: z.number().int(),
      }),
      items: z.array(LaunchSchema),
    }),
  },
});

export const findLaunchesCount = contract.query({
  summary: "Find the launches count.",
  method: "GET",
  path: "/v1/launches/count",
  query: z.object({
    reportId: z.coerce.number().int().optional().describe("The report ID the launches should belong to."),
    distinct: z.coerce.boolean().optional().default(false).describe("Distinct is defined by uniqeness of combination correlation ID and arguments hash."),
  }),
  responses: {
    200: z.object({count: z.number().int()}),
  },
});

export const patchLaunch = contract.mutation({
  summary: "Patch the launch fields.",
  method: "PATCH",
  path: "/v1/launches/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  body: PatchLaunchSchema,
  responses: {
    200: LaunchSchema,
    404: z.object({}),
  },
});

export const deleteLaunch = contract.mutation({
  summary: "Delete the launch by ID.",
  method: "DELETE",
  path: "/v1/launches/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  body: contract.noBody(),
  responses: {
    204: z.void(),
    404: z.object({}),
  },
});
