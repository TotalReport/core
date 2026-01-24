import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";

const generator = new CoreEntititesGenerator(client);

describe("launches", () => {
  test("read launch by id", async () => {
    const request = {
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
        id: launchId,
        title: request.title,
        createdTimestamp: request.createdTimestamp.toISOString(),
        startedTimestamp: request.startedTimestamp.toISOString(),
        finishedTimestamp: request.finishedTimestamp.toISOString(),
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
        id: launch.id,
        title: patchRequest.title,
        createdTimestamp: patchRequest.createdTimestamp.toISOString(),
        startedTimestamp: patchRequest.startedTimestamp.toISOString(),
        finishedTimestamp: patchRequest.finishedTimestamp.toISOString(),
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
