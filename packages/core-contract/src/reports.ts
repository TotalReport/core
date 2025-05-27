import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { PAGINATION_DEFAULTS } from "./defaults.js";

extendZodWithOpenApi(z);

export const ReportSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  createdTimestamp: z.string(),
});

const contract = initContract();

export const createReport = contract.mutation({
  method: "POST",
  path: "/v1/reports",
  responses: {
    201: ReportSchema,
  },
  body: z.object({
    title: z.string(),
  }),
  summary: "Create the report.",
});

export const readReport = contract.query({
  method: "GET",
  path: "/v1/reports/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  responses: {
    200: ReportSchema,
    404: z.object({}),
  },
  summary: "Read the report by ID.",
});

export const findReports = contract.query({
  summary: "Find the reports.",
  method: "GET",
  path: "/v1/reports",
  query: z.object({
    "title~cnt": z
      .string()
      .optional()
      .describe("The title of the report contains the string."),
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
  }),
  responses: {
    200: z.object({
      pagination: z.object({
        total: z.number().int(),
        limit: z.number().int(),
        offset: z.number().int(),
      }),
      items: z.array(ReportSchema),
    }),
  },
});

export const deleteReport = contract.mutation({
  summary: "Delete the report by ID.",
  method: "DELETE",
  path: "/v1/reports/:id",
  pathParams: z.object({
    id: z.coerce.number().int(),
  }),
  body: contract.noBody(),
  responses: {
    204: z.void(),
    404: z.object({}),
  },
});
