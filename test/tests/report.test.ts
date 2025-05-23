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

  test("searches reports by title", async () => {
    // Create reports with different titles
    const reportsGenerator = new ReportsGenerator(client);
    const reportWithTargetTitle1 = await reportsGenerator.create({
      title: "Alpha Test Report Colibri2",
    });
    const reportWithTargetTitle2 = await reportsGenerator.create({
      title: "Another Test Report Colibri2",
    });
    const reportWithoutTargetTitle = await reportsGenerator.create({
      title: "Production Summary",
    });

    // Search for reports with "Colibri2" in the title
    const findReportsResponse = await client.findReports({
      query: {
        "title~cnt": "Colibri2",
        limit: 10,
        offset: 0,
      },
    });

    // Verify that only reports with "Colibri2" in the title are returned
    expect(findReportsResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        pagination: {
          total: 2,
          limit: 10,
          offset: 0,
        },
        items: [
          reportWithTargetTitle1,
          reportWithTargetTitle2,
        ],
      },
    });
  });
});
