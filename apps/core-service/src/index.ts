import { contract } from "@total-report/core-contract/contract";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { ValidationError } from "./errors/errors.js";
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
  findTestStatusGroupsRoute,
  findTestStatusesRoute,
  readTestStatusGroupRoute,
  readTestStatusRoute,
} from "./routes/statuses.js";
import {
  createTestStepRoute,
  deleteTestStepRoute,
  findTestStepsRoute,
  patchTestStepRoute,
  readTestStepRoute,
} from "./routes/test-steps.js";
import {
  createTestRoute,
  deleteTestRoute,
  findTestEntitiesCountsByStatusesRoute,
  findTestsRoute,
  patchTestRoute,
  readTestRoute
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

  createLaunch: createLaunchRoute,
  findLaunchesCount: findLaunchesCountRoute,
  readLaunch: readLaunchRoute,
  findLaunches: findLaunchesRoute,
  patchLaunch: patchLaunchRoute,
  deleteLaunch: deleteLaunchRoute,

  createTest: createTestRoute,
  findTests: findTestsRoute,
  readTest: readTestRoute,
  patchTest: patchTestRoute,
  deleteTest: deleteTestRoute,
  findTestEntitiesCountsByStatuses: findTestEntitiesCountsByStatusesRoute,

  createTestStep: createTestStepRoute,
  readTestStep: readTestStepRoute,
  findTestSteps: findTestStepsRoute,
  patchTestStep: patchTestStepRoute,
  deleteTestStep: deleteTestStepRoute,

  findTestStatusGroups: findTestStatusGroupsRoute,
  findTestStatuses: findTestStatusesRoute,
  readTestStatusGroup: readTestStatusGroupRoute,
  readTestStatus: readTestStatusRoute,
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
