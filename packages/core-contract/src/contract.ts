import { initContract } from "@ts-rest/core";
import { z } from "zod";

const HealthCheckSchema = z.object({
    apiStarted: z.boolean(),
    databaseAccessible: z.boolean()
  });

export const contract = initContract().router({
    healthCheck: {
        method: "GET",
        path: "/healthcheck",
        responses: {
          200: HealthCheckSchema,
          503: HealthCheckSchema
        },
        summary: "Get health check status",
      }
});
