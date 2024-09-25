import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { createBeforeTest } from "./before-tests.js";
import { createTest } from "./tests.js";
import { createTestContext } from "./test-contexts.js";
import { createAfterTest } from "./after-tests.js";
import { createBeforeTestStep } from "./before-test-steps.js";
import { createTestStep } from "./test-steps.js";
import { createAfterTestStep } from "./after-test-steps.js";
import { createReport, deleteReport, readReport } from "./reports.js";

extendZodWithOpenApi(z);

const HealthCheckSchema = z.object({
  apiStarted: z.boolean(),
  databaseAccessible: z.boolean(),
});

const LaunchSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdTimestamp: z.string(),
  startedTimestamp: z.string().nullable(),
  finishedTimestamp: z.string().nullable(),
  reportId: z.string().uuid(),
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

  createLaunch: {
    method: "POST",
    path: "/v1/launches",
    responses: {
      201: LaunchSchema,
    },
    body: z.object({
      reportId: z.string().uuid(),
      title: z.string(),
    }),
    summary: "Create the launch.",
  },
  readLaunch: {
    method: "GET",
    path: "/v1/launches/:id",
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    responses: {
      201: LaunchSchema,
      404: z.object({}),
    },
    summary: "Read the launch by ID.",
  },
  deleteLaunch: {
    method: "DELETE",
    path: "/v1/launches/:id",
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    responses: {
      204: c.type<void>(),
      404: z.object({}),
    },
    body: c.type<void>(),
  },
  updateLaunchStarted: {
    summary: "Update the launch started timestamp.",
    method: "PATCH",
    path: "/v1/launches/:id/started",
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      startedTimestamp: z.string().datetime({ offset: true }).nullish(),
    }),
    responses: {
      200: LaunchSchema,
      404: z.object({}),
    },
  },
  updateLaunchFinished: {
    summary: "Update the launch finished timestamp.",
    method: "PATCH",
    path: "/v1/launches/:id/finished",
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      finishedTimestamp: z.string().datetime({ offset: true }).nullish(),
    }),
    responses: {
      200: LaunchSchema,
      404: z.object({}),
    },
  },
  createTestContext: createTestContext,
  createBeforeTest: createBeforeTest,
  createBeforeTestStep: createBeforeTestStep,
  createTest: createTest,
  createTestStep: createTestStep,
  createAfterTest: createAfterTest,
  createAfterTestStep: createAfterTestStep,
});
