import { LaunchesGenerator } from "@total-report/core-entities-generator/launch";
import { ReportsGenerator } from "@total-report/core-entities-generator/report";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../tools/client.js";
import { expect_toBe, expect_toBeCloseToNow } from "../tools/utils.js";

describe("reports", () => {
  test("create report", async () => {
    let createReportResponse = await client.createReport({
      body: {
        title: "New report",
      },
    });

    expect(createReportResponse).toEqual({
      headers: expect.anything(),
      status: 201,
      body: {
        id: expect.a(Number),
        title: "New report",
        createdTimestamp: expect.isCloseToNow(3000),
      },
    });
  });

  test("read report by id", async () => {
    let report = await new ReportsGenerator(client).create();

    const reportByIdResponse = await client.readReport({
      params: { id: report.id },
    });

    expect(reportByIdResponse).toEqual({
      status: 200,
      body: report,
      headers: expect.anything(),
    })
  });

  test("delete report", async () => {
    let report = await new ReportsGenerator(client).create();

    const deleteReportResponse = await client.deleteReport({
      params: { id: report.id },
    });
    expect(deleteReportResponse.status).toEqual(204);

    const reportByIdAfterDeleteResponse = await client.readReport({
      params: { id: report.id },
    });
    expect(reportByIdAfterDeleteResponse).toEqual({
      status: 404,
      body: {},
      headers: expect.anything(),
    });
  });

  test("delete report with launches", async () => {
    let launch = await new LaunchesGenerator(client).create();

    const deleteReportResponse = await client.deleteReport({
      params: { id: launch.reportId },
    });
    expect(deleteReportResponse.status).toEqual(204);

    const reportByIdAfterDeleteResponse = await client.readReport({
      params: { id: launch.reportId },
    });

    expect(reportByIdAfterDeleteResponse).toEqual({
      status: 404,
      body: {},
      headers: expect.anything(),
    });
  });
});
