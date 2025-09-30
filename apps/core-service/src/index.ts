import { contract } from "@total-report/core-contract/contract";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { ValidationError } from "./errors/errors.js";
import {
  createAfterTestStepRoute,
  deleteAfterTestStepRoute,
  findAfterTestStepsRoute,
  patchAfterTestStepRoute,
  readAfterTestStepRoute,
} from "./routes/after-test-steps.js";
import {
  createAfterTestRoute,
  deleteAfterTestRoute,
  findAfterTestsRoute,
  patchAfterTestRoute,
  readAfterTestRoute,
} from "./routes/after-tests.js";
import {
  createBeforeTestStepRoute,
  deleteBeforeTestStepRoute,
  findBeforeTestStepsRoute,
  patchBeforeTestStepRoute,
  readBeforeTestStepRoute,
} from "./routes/before-test-steps.js";
import {
  createBeforeTestRoute,
  deleteBeforeTestRoute,
  findBeforeTestsRoute,
  patchBeforeTestRoute,
  readBeforeTestRoute,
} from "./routes/before-tests.js";
import { healthCheckRoute, setApiStarted } from "./routes/healthcheck.js";
import {
  createLaunchRoute,
  deleteLaunchRoute,
  findLaunchesCountRoute,
  findLaunchesRoute,
  patchLaunchRoute,
  readLaunchRoute,
} from "./routes/launches.js";
import { openapiSchema } from "./routes/openapi_schema.js";
import {
  createReportRoute,
  deleteReportRoute,
  findReportsRoute,
  readReportRoute,
} from "./routes/reports.js";
import {
  findTestStatusGroupsRoute,
  findTestStatusesRoute,
  readTestStatusGroupRoute,
  readTestStatusRoute,
} from "./routes/statuses.js";
import {
  createTestContextRoute,
  deleteTestContextRoute,
  findTestContextsByLaunchIdRoute,
  patchTestContextRoute,
  readTestContextRoute,
} from "./routes/test-contexts.js";
import {
  findTestEntitiesCountsByStatusesRoute,
  findTestEntitiesRoute,
} from "./routes/test-entities.js";
import {
  createTestStepRoute,
  deleteTestStepRoute,
  patchTestStepRoute,
  readTestStepRoute,
} from "./routes/test-steps.js";
import {
  createTestRoute,
  deleteTestRoute,
  findTestsRoute,
  patchTestRoute,
  readTestRoute,
} from "./routes/tests.js";

const { urlencoded, json } = bodyParser;

const app = express();

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

app.get("/openapi", openapiSchema);

const s = initServer();

const router = s.router(contract, {
  healthCheck: healthCheckRoute,

  createReport: createReportRoute,
  readReport: readReportRoute,
  findReports: findReportsRoute,
  deleteReport: deleteReportRoute,

  createLaunch: createLaunchRoute,
  findLaunchesCount: findLaunchesCountRoute,
  readLaunch: readLaunchRoute,
  findLaunches: findLaunchesRoute,
  patchLaunch: patchLaunchRoute,
  deleteLaunch: deleteLaunchRoute,

  createTestContext: createTestContextRoute,
  readTestContext: readTestContextRoute,
  patchTestContext: patchTestContextRoute,
  findTestContextsByLaunchId: findTestContextsByLaunchIdRoute,
  deleteTestContext: deleteTestContextRoute,

  createBeforeTest: createBeforeTestRoute,
  findBeforeTests: findBeforeTestsRoute,
  readBeforeTest: readBeforeTestRoute,
  patchBeforeTest: patchBeforeTestRoute,
  deleteBeforeTest: deleteBeforeTestRoute,

  createBeforeTestStep: createBeforeTestStepRoute,
  readBeforeTestStep: readBeforeTestStepRoute,
  findBeforeTestSteps: findBeforeTestStepsRoute,
  patchBeforeTestStep: patchBeforeTestStepRoute,
  deleteBeforeTestStep: deleteBeforeTestStepRoute,

  createTest: createTestRoute,
  findTests: findTestsRoute,
  readTest: readTestRoute,
  patchTest: patchTestRoute,
  deleteTest: deleteTestRoute,

  createTestStep: createTestStepRoute,
  readTestStep: readTestStepRoute,
  patchTestStep: patchTestStepRoute,
  deleteTestStep: deleteTestStepRoute,

  createAfterTest: createAfterTestRoute,
  findAfterTests: findAfterTestsRoute,
  readAfterTest: readAfterTestRoute,
  patchAfterTest: patchAfterTestRoute,
  deleteAfterTest: deleteAfterTestRoute,

  createAfterTestStep: createAfterTestStepRoute,
  readAfterTestStep: readAfterTestStepRoute,
  findAfterTestSteps: findAfterTestStepsRoute,
  patchAfterTestStep: patchAfterTestStepRoute,
  deleteAfterTestStep: deleteAfterTestStepRoute,

  findTestStatusGroups: findTestStatusGroupsRoute,
  findTestStatuses: findTestStatusesRoute,
  readTestStatusGroup: readTestStatusGroupRoute,
  readTestStatus: readTestStatusRoute,

  findTestEntities: findTestEntitiesRoute,
  findTestEntitiesCountsByStatuses: findTestEntitiesCountsByStatusesRoute,
});

createExpressEndpoints(contract, router, app);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidationError) {
    res.status(400).send({ message: err.message });
  }

  console.error(err);
  res.status(500).send({ message: "Something went wrong." });
});

const port = process.env.CORE_SERVICE_PORT || 3333;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
  setApiStarted(true);
});
