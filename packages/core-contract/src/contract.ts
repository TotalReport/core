import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  createAfterTestStep,
  deleteAfterTestStep,
  findAfterTestSteps,
  patchAfterTestStep,
  readAfterTestStep,
} from "./after-test-steps.js";
import {
  createAfterTest,
  deleteAfterTest,
  findAfterTests,
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
  findBeforeTests,
  patchBeforeTest,
  readBeforeTest,
} from "./before-tests.js";
import {
  createLaunch,
  deleteLaunch,
  findLaunches,
  findLaunchesCount,
  patchLaunch,
  readLaunch,
} from "./launches.js";
import { createReport, deleteReport, findReports, readReport } from "./reports.js";
import {
  findTestStatusGroups,
  findTestStatuses,
  readTestStatus,
  readTestStatusGroup,
} from "./statuses.js";
import {
  createTestContext,
  deleteTestContext,
  findTestContextsByLaunchId,
  patchTestContext,
  readTestContext,
} from "./test-contexts.js";
import { findTestEntities, findTestEntitiesCountsByStatuses } from "./test-entities.js";
import {
  createTestStep,
  deleteTestStep,
  patchTestStep,
  readTestStep,
} from "./test-steps.js";
import { createTest, deleteTest, findTests, patchTest, readTest } from "./tests.js";

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
  findReports: findReports,
  deleteReport: deleteReport,

  createLaunch: createLaunch,
  findLaunchesCount: findLaunchesCount,
  readLaunch: readLaunch,
  findLaunches: findLaunches,
  patchLaunch: patchLaunch,
  deleteLaunch: deleteLaunch,

  createTestContext: createTestContext,
  readTestContext: readTestContext,
  patchTestContext: patchTestContext,
  findTestContextsByLaunchId: findTestContextsByLaunchId,
  deleteTestContext: deleteTestContext,

  createBeforeTest: createBeforeTest,
  readBeforeTest: readBeforeTest,
  findBeforeTests: findBeforeTests,
  patchBeforeTest: patchBeforeTest,
  deleteBeforeTest: deleteBeforeTest,

  createBeforeTestStep: createBeforeTestStep,
  readBeforeTestStep: readBeforeTestStep,
  patchBeforeTestStep: patchBeforeTestStep,
  deleteBeforeTestStep: deleteBeforeTestStep,

  createTest: createTest,
  readTest: readTest,
  findTests: findTests,
  patchTest: patchTest,
  deleteTest: deleteTest,

  createTestStep: createTestStep,
  readTestStep: readTestStep,
  patchTestStep: patchTestStep,
  deleteTestStep: deleteTestStep,

  createAfterTest: createAfterTest,
  readAfterTest: readAfterTest,
  findAfterTests: findAfterTests,
  patchAfterTest: patchAfterTest,
  deleteAfterTest: deleteAfterTest,

  createAfterTestStep: createAfterTestStep,
  readAfterTestStep: readAfterTestStep,
  findAfterTestSteps: findAfterTestSteps,
  patchAfterTestStep: patchAfterTestStep,
  deleteAfterTestStep: deleteAfterTestStep,

  findTestStatusGroups: findTestStatusGroups,
  findTestStatuses: findTestStatuses,
  readTestStatusGroup: readTestStatusGroup,
  readTestStatus: readTestStatus,

  findTestEntities: findTestEntities,
  findTestEntitiesCountsByStatuses: findTestEntitiesCountsByStatuses
});
