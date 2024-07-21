import { describe, expect, test } from "@jest/globals";
import { expect_toBe, expect_toBeCloseToNow } from "../tools/utils.js";
import { generateReport } from "../tools/report-generator.js";
import { generateLaunch } from "../tools/launch-generator.js";
import { client } from "../tools/client.js";

describe("reports", () => {
  test("create report", async () => {
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
  });

  test("read report", async () => {
    let report = await generateReport();

    const reportByIdResponse = await client.readReport({
      params: { id: report.id },
    });

    expect_toBe(reportByIdResponse.status, 200);
    expect(reportByIdResponse.body).toEqual(report);
  });

  test("delete report", async () => {
    let report = await generateReport();

    const deleteReportResponse = await client.deleteReport({
      params: { id: report.id },
      body: undefined,
    });
    expect(deleteReportResponse.status).toBe(204);

    const reportByIdAfterDeleteResponse = await client.readReport({
      params: { id: report.id },
    });
    expect_toBe(reportByIdAfterDeleteResponse.status, 404);
    expect(reportByIdAfterDeleteResponse.body).toEqual({});
  });

  test("delete report with launches", async () => {
    let launch = await generateLaunch();

    const deleteReportResponse = await client.deleteReport({
      params: { id: launch.reportId },
      body: undefined,
    });
    expect(deleteReportResponse.status).toBe(204);

    const reportByIdAfterDeleteResponse = await client.readReport({
      params: { id: launch.reportId },
    });
    expect_toBe(reportByIdAfterDeleteResponse.status, 404);
    expect(reportByIdAfterDeleteResponse.body).toEqual({});
  });
});
