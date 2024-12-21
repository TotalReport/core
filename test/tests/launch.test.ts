import { LaunchesGenerator } from "@total-report/core-entities-generator/launch";
import { ReportsGenerator } from "@total-report/core-entities-generator/report";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../tools/client.js";
import "../tools/earl-extensions.js";

describe("launches", () => {
  test("create launch with minimum fields", async () => {
    const report = await new ReportsGenerator(client).create();
    const request = { title: "New launch", reportId: report.id };

    const response = await client.createLaunch({ body: request });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 201,
      body: {
        id: expect.a(Number),
        title: request.title,
        reportId: report.id,
        createdTimestamp: expect.isCloseToNow(3000),
      },
    });
  });

  test("create launch with maximum fields", async () => {
    const report = await new ReportsGenerator(client).create();
    const request = {
      reportId: report.id,
      title: "Launch 2",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
    };

    const response = await client.createLaunch({ body: request });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 201,
      body: {
        reportId: report.id,
        id: expect.a(Number),
        title: request.title,
        createdTimestamp: request.createdTimestamp.toISOString(),
        startedTimestamp: request.startedTimestamp.toISOString(),
        finishedTimestamp: request.finishedTimestamp.toISOString(),
      },
    });
  });

  test("read launch by id", async () => {
    const report = await new ReportsGenerator(client).create();
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
      },
    });
  });

  test("find launches", async () => {
    const report = await new ReportsGenerator(client).create();
    const request1 = {
      reportId: report.id,
      title: "Launch 1",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
    };
    const request2 = {
      reportId: report.id,
      title: "Launch 2",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
    };
    const request3 = {
      reportId: report.id,
      title: "Launch 3",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
    };
    const launch1 = await new LaunchesGenerator(client).create(request1);
    const launch2 = await new LaunchesGenerator(client).create(request2);
    const launch3 = await new LaunchesGenerator(client).create(request3);

    const findLaunchesResponse = await client.findLaunches({ query: {
      reportId: report.id,
      limit: 2,
      offset: 0,
    } });

    expect(findLaunchesResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        items: [
          launch1,
          launch2
        ],
        pagination: {
          total: 3,
          limit: 2,
          offset: 0,
        },
      },
    });
  });

  test("patch launch all fields", async () => {
    const launch = await new LaunchesGenerator(client).create({
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
      },
    });
  });

  test("delete launch", async () => {
    const launch = await new LaunchesGenerator(client).create();

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
