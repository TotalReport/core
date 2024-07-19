import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { extendZodWithOpenApi } from "@anatine/zod-openapi";

extendZodWithOpenApi(z);

const HealthCheckSchema = z.object({
  apiStarted: z.boolean(),
  databaseAccessible: z.boolean(),
});

const ReportSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdTimestamp: z.string(),
});

const c = initContract()

export const contract = c.router({
  healthCheck: {
    method: "GET",
    path: "/healthcheck",
    responses: {
      200: HealthCheckSchema,
      503: HealthCheckSchema,
    },
    summary: "Get a health check status.",
  },
  createReport: {
    method: "POST",
    path: "/v1/reports",
    responses: {
      201: ReportSchema,
    },
    body: z.object({
      title: z.string(),
    }),
    summary: "Create the report.",
  },
  readReport: {
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
  },
  deleteReport: {
    method: "DELETE",
    path: "/v1/reports/:id",
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    responses: {
      204: c.type<void>(),
      404: z.object({}),
    },
    body: c.type<void>(),
    summary: "Delete the report by ID.",
  },
});
