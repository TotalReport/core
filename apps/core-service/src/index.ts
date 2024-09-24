import { contract } from "@total-report/core-contract/contract";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { createAfterTestStep } from "./routes/after-test-steps.js";
import { createAfterTest } from "./routes/after-tests.js";
import { createBeforeTestStep } from "./routes/before-test-steps.js";
import { createBeforeTest } from "./routes/before-tests.js";
import { healthCheckRoute, setApiStarted } from "./routes/healthcheck.js";
import {
  createLaunchRoute,
  deleteLaunchRoute,
  readLaunchRoute,
  updateLaunchFinishedRoute,
  updateLaunchStartedRoute,
} from "./routes/launches.js";
import { openapiSchema } from "./routes/openapi_schema.js";
import {
  createReportRoute,
  deleteReportRoute,
  readReportRoute,
} from "./routes/reports.js";
import { createTestContext } from "./routes/test-contexts.js";
import { createTestStep } from "./routes/test-steps.js";
import { createTest } from "./routes/tests.js";

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
  deleteLaunch: deleteLaunchRoute,
  updateLaunchStarted: updateLaunchStartedRoute,
  updateLaunchFinished: updateLaunchFinishedRoute,
  createTestContext: createTestContext,
  createBeforeTest: createBeforeTest,
  createBeforeTestStep: createBeforeTestStep,
  createTest: createTest,
  createTestStep: createTestStep,
  createAfterTest: createAfterTest,
  createAfterTestStep: createAfterTestStep,
});

createExpressEndpoints(contract, router, app);

const port = process.env.CORE_SERVICE_PORT || 3333;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
  setApiStarted(true);
});
