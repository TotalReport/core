import { publicClient } from "../tools/client.js";
import { describe, test } from "mocha";
import { expect } from "earl";

describe("healthcheck", () => {
  test("returns success", async () => {
    let healthCheckResponse = await publicClient.healthCheck();

    expect(healthCheckResponse.status).toEqual(200);
    expect(healthCheckResponse.body).toEqual({
      apiStarted: true,
      databaseAccessible: true,
    });
  });
});
