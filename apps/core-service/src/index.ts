import { contract } from "@total-report/core-contract/contract";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { createAfterTestStep } from "./routes/after-test-steps.js";
import { createAfterTest } from "./routes/after-tests.js";
import { createBeforeTestStep } from "./routes/before-test-steps.js";
import { createBeforeTestRoute, readBeforeTestRoute } from "./routes/before-tests.js";
import { healthCheckRoute, setApiStarted } from "./routes/healthcheck.js";
import {
  createLaunchRoute,
  deleteLaunchRoute,
  patchLaunchRoute,
  readLaunchRoute,
} from "./routes/launches.js";
import { openapiSchema } from "./routes/openapi_schema.js";
import {
  createReportRoute,
  deleteReportRoute,
  readReportRoute,
} from "./routes/reports.js";
import {
  createTestContextRoute,
  deleteTestContextRoute,
  patchTestContextRoute,
  readTestContextRoute,
} from "./routes/test-contexts.js";
import { createTestStep } from "./routes/test-steps.js";
import { createTest } from "./routes/tests.js";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "./errors/errors.js";

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
  deleteReport: deleteReportRoute,

  createLaunch: createLaunchRoute,
  readLaunch: readLaunchRoute,
  patchLaunch: patchLaunchRoute,
  deleteLaunch: deleteLaunchRoute,

  createTestContext: createTestContextRoute,
  readTestContext: readTestContextRoute,
  patchTestContext: patchTestContextRoute,
  deleteTestContext: deleteTestContextRoute,

  createBeforeTest: createBeforeTestRoute,
  readBeforeTest: readBeforeTestRoute,

  createBeforeTestStep: createBeforeTestStep,

  createTest: createTest,
  createTestStep: createTestStep,

  createAfterTest: createAfterTest,
  createAfterTestStep: createAfterTestStep,
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
