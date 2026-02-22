import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  createLaunch,
  deleteLaunch,
  findLaunches,
  findLaunchesCount,
  patchLaunch,
  readLaunch,
} from "./launches.js";
import {
  findTestStatusGroups,
  findTestStatuses,
  readTestStatus,
  readTestStatusGroup,
} from "./statuses.js";
import {
  createTestStep,
  deleteTestStep,
  findTestSteps,
  patchTestStep,
  readTestStep,
} from "./test-steps.js";
import {
  createTest,
  deleteTest,
  findTestEntitiesCountsByStatuses,
  findTests,
  patchTest,
  readTest,
} from "./tests.js";

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

  createLaunch: createLaunch,
  findLaunchesCount: findLaunchesCount,
  readLaunch: readLaunch,
  findLaunches: findLaunches,
  patchLaunch: patchLaunch,
  deleteLaunch: deleteLaunch,

  createTest: createTest,
  readTest: readTest,
  findTests: findTests,
  patchTest: patchTest,
  deleteTest: deleteTest,
  findTestEntitiesCountsByStatuses: findTestEntitiesCountsByStatuses,

  createTestStep: createTestStep,
  readTestStep: readTestStep,
  findTestSteps: findTestSteps,
  patchTestStep: patchTestStep,
  deleteTestStep: deleteTestStep,

  findTestStatusGroups: findTestStatusGroups,
  findTestStatuses: findTestStatuses,
  readTestStatusGroup: readTestStatusGroup,
  readTestStatus: readTestStatus,
});
