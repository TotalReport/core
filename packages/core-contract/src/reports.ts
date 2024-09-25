import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { initContract } from "@ts-rest/core";
import { z } from "zod";

extendZodWithOpenApi(z);

const ReportSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdTimestamp: z.string(),
});

const reportContract = initContract();

export const createReport = reportContract.mutation({
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

export const readReport = reportContract.query({
  method: "GET",
  path: "/v1/reports/:id",
  pathParams: z.object({
    id: z.string().uuid(),
  }),
  responses: {
    201: ReportSchema,
    404: z.object({}),
  },
  summary: "Read the report by ID.",
});

export const deleteReport = reportContract.mutation({
  method: "DELETE",
  path: "/v1/reports/:id",
  pathParams: z.object({
    id: z.string().uuid(),
  }),
  responses: {
    204: reportContract.type<void>(),
    404: z.object({}),
  },
  body: reportContract.type<void>(),
  summary: "Delete the report by ID.",
});
