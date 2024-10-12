import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  createAfterTestStep,
  deleteAfterTestStep,
  patchAfterTestStep,
  readAfterTestStep,
} from "./after-test-steps.js";
import {
  createAfterTest,
  deleteAfterTest,
  patchAfterTest,
  readAfterTest,
} from "./after-tests.js";
import {
  createBeforeTestStep,
  deleteBeforeTestStep,
  patchBeforeTestStep,
  readBeforeTestStep,
} from "./before-test-steps.js";
import {
  createBeforeTest,
  deleteBeforeTest,
  patchBeforeTest,
  readBeforeTest,
} from "./before-tests.js";
import {
  createLaunch,
  deleteLaunch,
  patchLaunch,
  readLaunch,
} from "./launches.js";
import { createReport, deleteReport, readReport } from "./reports.js";
import {
  createTestContext,
  deleteTestContext,
  patchTestContext,
  readTestContext,
} from "./test-contexts.js";
import {
  createTestStep,
  deleteTestStep,
  patchTestStep,
  readTestStep,
} from "./test-steps.js";
import { createTest, deleteTest, patchTest, readTest } from "./tests.js";

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
  readBeforeTest: readBeforeTest,
  patchBeforeTest: patchBeforeTest,
  deleteBeforeTest: deleteBeforeTest,

  createBeforeTestStep: createBeforeTestStep,
  readBeforeTestStep: readBeforeTestStep,
  patchBeforeTestStep: patchBeforeTestStep,
  deleteBeforeTestStep: deleteBeforeTestStep,

  createTest: createTest,
  readTest: readTest,
  patchTest: patchTest,
  deleteTest: deleteTest,

  createTestStep: createTestStep,
  readTestStep: readTestStep,
  patchTestStep: patchTestStep,
  deleteTestStep: deleteTestStep,

  createAfterTest: createAfterTest,
  readAfterTest: readAfterTest,
  patchAfterTest: patchAfterTest,
  deleteAfterTest: deleteAfterTest,

  createAfterTestStep: createAfterTestStep,
  readAfterTestStep: readAfterTestStep,
  patchAfterTestStep: patchAfterTestStep,
  deleteAfterTestStep: deleteAfterTestStep,
});
