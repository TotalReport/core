import { createExpressEndpoints, initServer } from "@ts-rest/express";
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import { contract } from "@total-report/core-contract/contract";
import { generateOpenApi } from "@ts-rest/open-api";

let apiStarted = false;

const { urlencoded, json } = bodyParser;

const app = express();

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

app.get("/openapi", (_req, res) => {
  res.send(
    generateOpenApi(contract, {
      info: {
        title: "Total report API",
        version: "1.0.0",
      },
    })
  );
});

const s = initServer();

const router = s.router(contract, {
  healthCheck: async () => {
    return {
      status: apiStarted === false ? 503 : 200,
      body: {
        apiStarted: apiStarted,
        databaseAccessible: true,
      },
    };
  },
});

createExpressEndpoints(contract, router, app);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
  apiStarted = true;
});
