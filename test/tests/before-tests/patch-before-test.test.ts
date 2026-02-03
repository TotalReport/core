import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { DEFAULT_TEST_STATUSES } from "@total-report/core-schema/constants";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";

const generator = new CoreEntititesGenerator(client);

describe("patch before test", () => {
  test("with all fields", async () => {
    const launch = await generator.launches.create();
    const beforeTest = await generator.beforeTests.create({
      launchId: launch.id,
      title: "Text context 1",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
      statusId: DEFAULT_TEST_STATUSES.PASSED.id,
      arguments: [
        {
          name: "Argument1",
          type: "String",
          value: "value1",
        },
        {
          name: "Argument2",
          type: "Integer",
          value: "value2",
        },
      ],
    });
    const patchRequest = {
      title: "Text context 2",
      createdTimestamp: new Date("2024-08-21T06:47:32Z"),
      startedTimestamp: new Date("2024-08-21T06:51:35Z"),
      finishedTimestamp: new Date("2024-08-21T06:52:21Z"),
      statusId: DEFAULT_TEST_STATUSES.PRODUCT_BUG.id,
    };

    const patchResponse = await client.patchBeforeTest({
      params: { id: beforeTest.id },
      body: patchRequest,
    });

    expect(patchResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        launchId: beforeTest.launchId,
        id: beforeTest.id,
        title: patchRequest.title,
        createdTimestamp: patchRequest.createdTimestamp.toISOString(),
        startedTimestamp: patchRequest.startedTimestamp.toISOString(),
        finishedTimestamp: patchRequest.finishedTimestamp.toISOString(),
        statusId: patchRequest.statusId,
        argumentsHash: beforeTest.argumentsHash,
        arguments: beforeTest.arguments,
        correlationId: beforeTest.correlationId,
        externalArgumentsHash: beforeTest.externalArgumentsHash,
      },
    });
  });
});
