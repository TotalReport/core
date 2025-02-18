import { GenerateAfterTestArgs } from "@total-report/core-entities-generator/after-test";
import { GenerateBeforeTestArgs } from "@total-report/core-entities-generator/before-test";
import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { GenerateTestArgs } from "@total-report/core-entities-generator/test";
import { DEFAULT_TEST_STATUSES } from "@total-report/core-schema/constants";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";

const generator = new CoreEntititesGenerator(client);

describe("launches", () => {
  test("read launch by id", async () => {
    const report = await generator.reports.create();
    const request = {
      reportId: report.id,
      title: "Launch 2",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
    };
    const createLaunchResponse = await client.createLaunch({ body: request });
    expect(createLaunchResponse.status).toEqual(201);
    const launchId = (<{ id: number }>createLaunchResponse.body).id;

    const readLaunchById = await client.readLaunch({
      params: { id: launchId },
    });

    expect(readLaunchById).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        reportId: report.id,
        id: launchId,
        title: request.title,
        createdTimestamp: request.createdTimestamp.toISOString(),
        startedTimestamp: request.startedTimestamp.toISOString(),
        finishedTimestamp: request.finishedTimestamp.toISOString(),
        argumentsHash: "bbb93ef2-6e3c-101f-f11c-dd21cab08a94",
        correlationId: "89ca5a70-637a-b790-6d30-b4bcfdc4bf73",
      },
    });
  });

  // Test for launch statistics
  test("launch statistics", async () => {
    const report = await generator.reports.create();
    const launch1 = await generator.launches.create({ reportId: report.id });
    const testContext = await generator.contexts.create({
      launchId: launch1.id,
    });

    const launch2 = await generator.launches.create({ reportId: report.id });
    await generator.beforeTests.createMultiple(10, (index) => {
      const args: GenerateBeforeTestArgs = {
        launchId: launch1.id,
      };
      if (index == 0) {
        args.statusId = DEFAULT_TEST_STATUSES.SUCCESSFUL.id;
      }
      if (index == 1) {
        args.statusId = DEFAULT_TEST_STATUSES.ABORTED.id;
      }
      if (index == 2) {
        args.statusId = DEFAULT_TEST_STATUSES.SKIPPED.id;
      }
      if (index == 3) {
        args.statusId = DEFAULT_TEST_STATUSES.PRODUCT_BUG.id;
      }
      if (index == 4) {
        args.statusId = DEFAULT_TEST_STATUSES.AUTOMATION_BUG.id;
      }
      if (index == 5) {
        args.statusId = DEFAULT_TEST_STATUSES.SYSTEM_ISSUE.id;
      }
      if (index == 6) {
        args.statusId = DEFAULT_TEST_STATUSES.NO_DEFECT.id;
      }
      if (index == 7) {
        args.statusId = DEFAULT_TEST_STATUSES.TO_INVESTIGATE.id;
      }
      return args;
    });
    await generator.tests.createMultiple(36, (index) => {
      const args: GenerateTestArgs = {
        launchId: launch1.id,
      };
      if (index < 3) {
        args.testContextId = testContext.id;
      }
      if (index == 0) {
        args.statusId = DEFAULT_TEST_STATUSES.SUCCESSFUL.id;
      }
      if (1 <= index && index <= 1 + 1) {
        args.statusId = DEFAULT_TEST_STATUSES.ABORTED.id;
      }
      if (3 <= index && index <= 3 + 2) {
        args.statusId = DEFAULT_TEST_STATUSES.SKIPPED.id;
      }
      if (6 <= index && index <= 6 + 3) {
        args.statusId = DEFAULT_TEST_STATUSES.PRODUCT_BUG.id;
      }
      if (10 <= index && index <= 10 + 4) {
        args.statusId = DEFAULT_TEST_STATUSES.AUTOMATION_BUG.id;
      }
      if (15 <= index && index <= 15 + 5) {
        args.statusId = DEFAULT_TEST_STATUSES.SYSTEM_ISSUE.id;
      }
      if (21 <= index && index <= 21 + 6) {
        args.statusId = DEFAULT_TEST_STATUSES.NO_DEFECT.id;
      }
      if (28 <= index && index <= 28 + 7) {
        args.statusId = DEFAULT_TEST_STATUSES.TO_INVESTIGATE.id;
      }
      return args;
    });

    await generator.afterTests.createMultiple(10, (index) => {
      const args: GenerateAfterTestArgs = {
        launchId: launch1.id,
      };
      if (index == 0) {
        args.statusId = DEFAULT_TEST_STATUSES.SUCCESSFUL.id;
      }
      if (index == 1) {
        args.statusId = DEFAULT_TEST_STATUSES.ABORTED.id;
      }
      if (index == 2) {
        args.statusId = DEFAULT_TEST_STATUSES.SKIPPED.id;
      }
      if (index == 3) {
        args.statusId = DEFAULT_TEST_STATUSES.PRODUCT_BUG.id;
      }
      if (index == 4) {
        args.statusId = DEFAULT_TEST_STATUSES.AUTOMATION_BUG.id;
      }
      if (index == 5) {
        args.statusId = DEFAULT_TEST_STATUSES.SYSTEM_ISSUE.id;
      }
      if (index == 6) {
        args.statusId = DEFAULT_TEST_STATUSES.NO_DEFECT.id;
      }
      if (index == 7) {
        args.statusId = DEFAULT_TEST_STATUSES.TO_INVESTIGATE.id;
      }
      return args;
    });

    const statisticsResponse = await client.launchStatistics({
      params: { id: launch1.id },
    });

    expect(statisticsResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        beforeTests: expect.equalUnsorted([
          { statusGroupId: "SL", count: 1 },
          { statusGroupId: "AD", count: 1 },
          { statusGroupId: "SD", count: 1 },
          { statusGroupId: "PB", count: 1 },
          { statusGroupId: "AB", count: 1 },
          { statusGroupId: "SI", count: 1 },
          { statusGroupId: "ND", count: 1 },
          { statusGroupId: "TI", count: 1 },
          { statusGroupId: null, count: 2 },
        ]),
        tests: expect.equalUnsorted([
          { statusGroupId: "SL", count: 1 },
          { statusGroupId: "AD", count: 2 },
          { statusGroupId: "SD", count: 3 },
          { statusGroupId: "PB", count: 4 },
          { statusGroupId: "AB", count: 5 },
          { statusGroupId: "SI", count: 6 },
          { statusGroupId: "ND", count: 7 },
          { statusGroupId: "TI", count: 8 },
        ]),
        afterTests: expect.equalUnsorted([
          { statusGroupId: "SL", count: 1 },
          { statusGroupId: "AD", count: 1 },
          { statusGroupId: "SD", count: 1 },
          { statusGroupId: "PB", count: 1 },
          { statusGroupId: "AB", count: 1 },
          { statusGroupId: "SI", count: 1 },
          { statusGroupId: "ND", count: 1 },
          { statusGroupId: "TI", count: 1 },
          { statusGroupId: null, count: 2 },
        ]),
      },
    });
  });

  test("patch launch all fields", async () => {
    const launch = await generator.launches.create({
      title: "Launch 1",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
    });
    const patchRequest = {
      title: "Launch 2",
      createdTimestamp: new Date("2024-08-21T06:47:32Z"),
      startedTimestamp: new Date("2024-08-21T06:51:35Z"),
      finishedTimestamp: new Date("2024-08-21T06:52:21Z"),
    };

    const patchResponse = await client.patchLaunch({
      params: { id: launch.id },
      body: patchRequest,
    });

    expect(patchResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        reportId: launch.reportId,
        id: launch.id,
        title: patchRequest.title,
        createdTimestamp: patchRequest.createdTimestamp.toISOString(),
        startedTimestamp: patchRequest.startedTimestamp.toISOString(),
        finishedTimestamp: patchRequest.finishedTimestamp.toISOString(),
        argumentsHash: "bbb93ef2-6e3c-101f-f11c-dd21cab08a94",
        correlationId: "d8047e5c-4288-b647-c505-e5e6a9d22591",
      },
    });
  });


  test("delete launch", async () => {
    const launch = await generator.launches.create();

    const deleteLaunchResponse = await client.deleteLaunch({
      params: { id: launch.id },
    });

    expect(deleteLaunchResponse).toEqual({
      headers: expect.anything(),
      status: 204,
      body: expect.a(Blob),
    });

    const launchByIdAfterDeleteResponse = await client.readLaunch({
      params: { id: launch.id },
    });

    expect(launchByIdAfterDeleteResponse).toEqual({
      headers: expect.anything(),
      status: 404,
      body: {},
    });
  });
});
