import { createExpressEndpoints, initServer } from "@ts-rest/express";
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import { contract } from "@total-report/core-contract/contract";
import { healthCheckRoute, setApiStarted } from "./routes/healthcheck.js";
import { openapiSchema } from "./routes/openapi_schema.js";

let apiStarted = false;

const { urlencoded, json } = bodyParser;

const app = express();

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

app.get("/openapi", openapiSchema);

const s = initServer();

const router = s.router(contract, {
  healthCheck: healthCheckRoute,
});

createExpressEndpoints(contract, router, app);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
  setApiStarted(true);
});
