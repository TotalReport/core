import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { DEFAULT_TEST_STATUSES } from "@total-report/core-schema/constants";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";

const generator = new CoreEntititesGenerator(client);

describe("delete test", () => {
  test("by id", async () => {
    const launch = await generator.launches.create();

    const testContext = await generator.contexts.create({
      launchId: launch.id,
    });

    const test = await generator.tests.create({
      launchId: launch.id,
      testContextId: testContext.id,
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

    const deleteTestResponse = await client.deleteTest({
      params: { id: test.id },
    });

    expect(deleteTestResponse).toEqual({
      headers: expect.anything(),
      status: 204,
      body: expect.a(Blob),
    });

    const testByIdAfterDeleteResponse = await client.readTest({
      params: { id: test.id },
    });

    expect(testByIdAfterDeleteResponse).toEqual({
      headers: expect.anything(),
      status: 404,
      body: {},
    });

    const testContextByIdAfterDeleteResponse = await client.readTestContext({
      params: { id: testContext.id },
    });

    expect(testContextByIdAfterDeleteResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: testContext,
    });

    const launchByIdAfterDeleteResponse = await client.readLaunch({
      params: { id: test.launchId },
    });

    expect(launchByIdAfterDeleteResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: launch,
    });
  });
});
