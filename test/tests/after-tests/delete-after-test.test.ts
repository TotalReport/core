import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { DEFAULT_TEST_STATUSES } from "@total-report/core-schema/constants";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";

const generator = new CoreEntititesGenerator(client);

describe("delete after test", () => {
  test("by id", async () => {
    const launch = await generator.launches.create();
    const testContext = await generator.contexts.create({
      launchId: launch.id,
    });
    const afterTest = await generator.afterTests.create({
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

    const deleteLaunchResponse = await client.deleteAfterTest({
      params: { id: afterTest.id },
    });

    expect(deleteLaunchResponse).toEqual({
      headers: expect.anything(),
      status: 204,
      body: expect.a(Blob),
    });

    const afterTestByIdAfterDeleteResponse = await client.readAfterTest({
      params: { id: afterTest.id },
    });

    expect(afterTestByIdAfterDeleteResponse).toEqual({
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
      params: { id: afterTest.launchId },
    });

    expect(launchByIdAfterDeleteResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: launch,
    });
  });
});
