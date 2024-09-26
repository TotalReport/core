import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { createAfterTestStep } from "./after-test-steps.js";
import { createAfterTest } from "./after-tests.js";
import { createBeforeTestStep } from "./before-test-steps.js";
import { createBeforeTest } from "./before-tests.js";
import {
  createLaunch,
  deleteLaunch,
  readLaunch,
  patchLaunch,
} from "./launches.js";
import { createReport, deleteReport, readReport } from "./reports.js";
import { createTestContext, deleteTestContext, patchTestContext, readTestContext } from "./test-contexts.js";
import { createTestStep } from "./test-steps.js";
import { createTest } from "./tests.js";

extendZodWithOpenApi(z);

const HealthCheckSchema = z.object({
  apiStarted: z.boolean(),
  databaseAccessible: z.boolean(),
});

const c = initContract();

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

  createReport: createReport,
  readReport: readReport,
  deleteReport: deleteReport,

  createLaunch: createLaunch,
  readLaunch: readLaunch,
  patchLaunch: patchLaunch,
  deleteLaunch: deleteLaunch,

  createTestContext: createTestContext,
  readTestContext: readTestContext,
  patchTestContext: patchTestContext,
  deleteTestContext: deleteTestContext,

  createBeforeTest: createBeforeTest,
  createBeforeTestStep: createBeforeTestStep,
  createTest: createTest,
  createTestStep: createTestStep,
  createAfterTest: createAfterTest,
  createAfterTestStep: createAfterTestStep,
});
