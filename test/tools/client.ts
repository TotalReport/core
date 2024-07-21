import { contract } from "@total-report/core-contract/contract";
import { initClient } from "@ts-rest/core";

const port = process.env["CORE_SERVICE_PORT"];

export const client = initClient(contract, {
  baseUrl: `http://localhost:${port}`,
  baseHeaders: {},
});