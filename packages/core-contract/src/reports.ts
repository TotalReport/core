import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { initContract } from "@ts-rest/core";
import { z } from "zod";

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
    201: ReportSchema,
    404: z.object({}),
  },
  summary: "Read the report by ID.",
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
    204: contract.noBody(),
    404: z.object({}),
  },
});
