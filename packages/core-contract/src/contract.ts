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

export const contract = initContract().router({
  healthCheck: {
    method: "GET",
    path: "/healthcheck",
    responses: {
      200: HealthCheckSchema,
      503: HealthCheckSchema,
    },
    summary: "Get health check status.",
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
    summary: "Create a report.",
  },
});
