import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";

const generator = new CoreEntititesGenerator(client);

describe("find launches", () => {
  test("by reportId", async () => {
    const report = await generator.reports.create();
    const request1 = {
      reportId: report.id,
      title: "Launch 1",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
      argumentsHash: "bbb93ef2-6e3c-101f-f11c-dd21cab08a94",
      correlationId: "d8047e5c-4288-b647-c505-e5e6a9d22591",
    };
    const request2 = {
      reportId: report.id,
      title: "Launch 2",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
      argumentsHash: "bbb93ef2-6e3c-101f-f11c-dd21cab08a94",
      correlationId: "d8047e5c-4288-b647-c505-e5e6a9d22591",
    };
    const request3 = {
      reportId: report.id,
      title: "Launch 3",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
    };
    const launch1 = await generator.launches.create(request1);
    const launch2 = await generator.launches.create(request2);
    const launch3 = await generator.launches.create(request3);

    const findLaunchesResponse = await client.findLaunches({
      query: {
        reportId: report.id,
        limit: 2,
        offset: 0,
      },
    });

    expect(findLaunchesResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        items: [launch1, launch2],
        pagination: {
          total: 3,
          limit: 2,
          offset: 0,
        },
      },
    });
  });

  test("by correlationId", async () => {
    const correlationId1 = "48d33ef0-57e3-42b7-8ed4-e179d662cff2";
    const correlationId2 = "d987264c-3174-4396-86a7-a31cffa275db";
    const argumentsHash1 = "18832721-a82b-4d02-a8de-4da5213bebe1";
    const argumentsHash2 = "0923b90d-eff9-4f5f-bca9-af1181246baf";
    const report1 = await generator.reports.create();
    const report2 = await generator.reports.create();
    const report3 = await generator.reports.create();
    const request1 = {
      reportId: report1.id,
      title: "Launch 1",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
      correlationId: correlationId1,
      argumentsHash: argumentsHash1,
    };
    const request2 = {
      reportId: report2.id,
      title: "Launch 2",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
      correlationId: correlationId1,
      argumentsHash: argumentsHash2,
    };
    const request3 = {
      reportId: report3.id,
      title: "Launch 3",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
      correlationId: correlationId2,
      argumentsHash: argumentsHash1,
    };
    const launch1 = await generator.launches.create(request1);
    const launch2 = await generator.launches.create(request2);
    const launch3 = await generator.launches.create(request3);

    const findLaunchesResponse = await client.findLaunches({
      query: {
        correlationId: correlationId1,
        limit: 10,
        offset: 0,
      },
    });

    expect(findLaunchesResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        items: [launch1, launch2],
        pagination: {
          total: 2,
          limit: 10,
          offset: 0,
        },
      },
    });
  });

  test("by argumentsHash", async () => {
    const correlationId1 = "fea8cb58-2c43-43f8-8c0b-9c72a792e6d2";
    const correlationId2 = "2cd25ce4-3eb6-40bf-bc43-d4630b79e221";
    const argumentsHash1 = "5b1d6137-7e44-4a1d-a11c-b1fe7173b3e9";
    const argumentsHash2 = "5ca10336-1760-4998-a433-c40c75a7a996";
    const report1 = await generator.reports.create();
    const report2 = await generator.reports.create();
    const report3 = await generator.reports.create();
    const request1 = {
      reportId: report1.id,
      title: "Launch 1",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
      correlationId: correlationId1,
      argumentsHash: argumentsHash1,
    };
    const request2 = {
      reportId: report2.id,
      title: "Launch 2",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
      correlationId: correlationId1,
      argumentsHash: argumentsHash2,
    };
    const request3 = {
      reportId: report3.id,
      title: "Launch 3",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
      correlationId: correlationId2,
      argumentsHash: argumentsHash1,
    };
    const launch1 = await generator.launches.create(request1);
    const launch2 = await generator.launches.create(request2);
    const launch3 = await generator.launches.create(request3);

    const findLaunchesResponse = await client.findLaunches({
      query: {
        argumentsHash: argumentsHash1,
        limit: 10,
        offset: 0,
      },
    });

    expect(findLaunchesResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        items: [launch1, launch3],
        pagination: {
          total: 2,
          limit: 10,
          offset: 0,
        },
      },
    });
  });

  test("by title contains", async () => {
    const report = await generator.reports.create();
    const request1 = {
      reportId: report.id,
      title: "Launch Alpha",
    };
    const request2 = {
      reportId: report.id,
      title: "Launch Beta",
    };
    const request3 = {
      reportId: report.id,
      title: "Launch Gamma",
    };
    const request4 = {
      reportId: report.id,
      title: "Test Delta",
    };
    const launch1 = await generator.launches.create(request1);
    const launch2 = await generator.launches.create(request2);
    const launch3 = await generator.launches.create(request3);
    const launch4 = await generator.launches.create(request4);

    const limit = 10;
    const offset = 0;

    const response = await client.findLaunches({
      query: {
        reportId: report.id,
        "title~cnt": "Launch",
        limit,
        offset,
      },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        pagination: {
          total: 3,
          limit,
          offset,
        },
        items: [launch1, launch2, launch3],
      },
    });

    const response2 = await client.findLaunches({
      query: {
        reportId: report.id,
        "title~cnt": "Beta",
        limit,
        offset,
      },
    });

    expect(response2).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        pagination: {
          total: 1,
          limit,
          offset,
        },
        items: [launch2],
      },
    });
  });
});
