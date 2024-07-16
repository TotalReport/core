import { describe, expect, test } from "@jest/globals";
import { initClient } from "@ts-rest/core";
import { contract } from "@total-report/core-contract/contract";

const port = process.env["CORE_SERVICE_PORT"];

export const client = initClient(contract, {
  baseUrl: `http://localhost:${port}`,
  baseHeaders: {},
});

describe("healthcheck", () => {
  test("returns success", async () => {
    let healthCheckResponse = await client.healthCheck();

    expect(healthCheckResponse.status).toBe(200);
    expect(healthCheckResponse.body).toEqual({
      apiStarted: true,
      databaseAccessible: true,
    });
  });
});
