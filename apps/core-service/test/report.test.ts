import { describe, expect, test } from "@jest/globals";
import { initClient } from "@ts-rest/core";
import { contract } from "@total-report/core-contract/contract";
import "dotenv/config";

const port = process.env["CORE_SERVICE_PORT"];

export const client = initClient(contract, {
  baseUrl: `http://localhost:${port}`,
  baseHeaders: {},
});

describe("reports", () => {
  test("create report", async () => {
    let response = await client.createReport({
      body: {
        title: "New report",
      },
    });
    expect_toBe(response.status, 201);
    expect(response.body.id).not.toBeNull();
    expect(response.body.title).toBe("New report");
    expect_toBeCloseToNow(Date.parse(response.body.createdTimestamp), 1000);
  });
});

function expect_toBe<T>(arg: any, value: T): asserts arg is T {
  expect(arg).toBe(value);
}

function expect_toBeCloseTo(
  actual: number,
  expected: number,
  delta: number
): void {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(delta);
}

function expect_toBeCloseToNow(actual: number, delta: number): void {
  const nowLocal = new Date();
  const nowUtc = nowLocal.getTime() + nowLocal.getTimezoneOffset() * 60 * 1000;
  expect_toBeCloseTo(actual, nowUtc, delta);
}
