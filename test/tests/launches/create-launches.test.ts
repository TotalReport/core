import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";

const generator = new CoreEntititesGenerator(client);

describe("create launches", () => {
  test("with minimum fields", async () => {
    const report = await generator.reports.create();
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
        argumentsHash: "bbb93ef2-6e3c-101f-f11c-dd21cab08a94",
        correlationId: "e004f724-4921-921d-6512-785cd057c58d",
      },
    });
  });

  test("with maximum fields", async () => {
    const report = await generator.reports.create();
    const request = {
      reportId: report.id,
      title: "Launch 2",
      arguments: "--tests LaunchesTests",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
      argumentsHash: "6dc3765f-d191-4f04-aefc-30c760cfeb77",
      correlationId: "d8b01d07-b9bb-4d91-967c-29534858c644",
    };

    const response = await client.createLaunch({ body: request });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 201,
      body: {
        reportId: report.id,
        id: expect.a(Number),
        title: request.title,
        arguments: request.arguments,
        createdTimestamp: request.createdTimestamp.toISOString(),
        startedTimestamp: request.startedTimestamp.toISOString(),
        finishedTimestamp: request.finishedTimestamp.toISOString(),
        argumentsHash:  request.argumentsHash,
        correlationId: request.correlationId,
      },
    });
  });
});
