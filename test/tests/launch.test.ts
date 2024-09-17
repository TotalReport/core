import { describe, test } from "mocha";
import { expect } from "earl";
import { generateReport } from "../tools/report-generator.js";
import { expect_toBe, expect_toBeCloseToNow } from "../tools/utils.js";
import { generateLaunch } from "../tools/launch-generator.js";
import { client } from "../tools/client.js";

describe("launches", () => {
  test("create launch", async () => {
    const report = await generateReport();

    const createLaunch = await client.createLaunch({
      body: { title: "New launch", reportId: report.id },
    });

    expect_toBe(createLaunch.status, 201);
    expect(createLaunch.body.id).not.toBeNullish();
    expect(createLaunch.body.title).toEqual("New launch");
    expect(createLaunch.body.reportId).toEqual(report.id);
    expect_toBeCloseToNow(Date.parse(createLaunch.body.createdTimestamp), 1000);
  });

  test("read launch by id", async () => {
    const launch = await generateLaunch();

    const readLaunchById = await client.readLaunch({
      params: { id: launch.id },
    });
    expect_toBe(readLaunchById.status, 200);
    expect(readLaunchById.body).toEqual(launch);
  });

  test("delete launch", async () => {
    const launch = await generateLaunch();

    const deleteLaunch = await client.deleteLaunch({
      params: { id: launch.id },
      body: undefined,
    });

    expect(deleteLaunch.status).toEqual(204);

    const launchByIdAfterDelete = await client.readLaunch({
      params: { id: launch.id },
    });

    expect_toBe(launchByIdAfterDelete.status, 404);
  });

  test("update launch started", async () => {
    const launch = await generateLaunch();
    const date = "2024-07-21T06:52:32Z";
    const dateExpected = "2024-07-21 06:52:32";

    const updateLaunchStarted = await client.updateLaunchStarted({
      params: { id: launch.id },
      body: { startedTimestamp: date },
    });

    expect_toBe(updateLaunchStarted.status, 200);
    expect(updateLaunchStarted.body).toEqual({
      ...launch,
      startedTimestamp: dateExpected,
    });
  });

  test("update launch finished", async () => {
    const launch = await generateLaunch();
    const date = "2024-07-21T06:52:32Z";
    const dateExpected = "2024-07-21 06:52:32";

    const updateLaunchStarted = await client.updateLaunchFinished({
      params: { id: launch.id },
      body: { finishedTimestamp: date },
    });

    expect_toBe(updateLaunchStarted.status, 200);
    expect(updateLaunchStarted.body).toEqual({
      ...launch,
      finishedTimestamp: dateExpected,
    });
  });
});
