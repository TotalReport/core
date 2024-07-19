import { contract } from "@total-report/core-contract/contract";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { healthCheckRoute, setApiStarted } from "./routes/healthcheck.js";
import { openapiSchema } from "./routes/openapi_schema.js";
import { createReportRoute, readReportRoute } from "./routes/reports.js";

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
});

createExpressEndpoints(contract, router, app);

const port = process.env.CORE_SERVICE_PORT || 3333;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
  setApiStarted(true);
});
