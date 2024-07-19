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
  test("create and read report", async () => {
    let createReportResponse = await client.createReport({
      body: {
        title: "New report",
      },
    });
    expect_toBe(createReportResponse.status, 201);
    expect(createReportResponse.body.id).not.toBeNull();
    expect(createReportResponse.body.title).toBe("New report");
    expect_toBeCloseToNow(
      Date.parse(createReportResponse.body.createdTimestamp),
      1000
    );

    const reportByIdResponse = await client.readReport({
      params: { id: createReportResponse.body.id },
    });
    expect_toBe(reportByIdResponse.status, 200);
    expect(reportByIdResponse.body).toEqual(createReportResponse.body);

    const deleteReportResponse = await client.deleteReport({
      params: { id: createReportResponse.body.id },
      body: undefined,
    });
    expect(deleteReportResponse.status).toBe(204);

    const reportByIdAfterDeleteResponse = await client.readReport({
      params: { id: createReportResponse.body.id },
    });
    expect_toBe(reportByIdAfterDeleteResponse.status, 404);
    expect(reportByIdAfterDeleteResponse.body).toEqual({});
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
