import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { DEFAULT_TEST_STATUSES } from "@total-report/core-schema/constants";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";

const generator = new CoreEntititesGenerator(client);
const types: ("beforeTest" | "test" | "afterTest")[] = [
  "beforeTest",
  "test",
  "afterTest",
];

types.forEach((type: "beforeTest" | "test" | "afterTest") =>
  describe("patch " + type, () => {
    test("with all fields", async () => {
      const launch = await generator.launches.create();
      const test = await generator.tests.create({
        entityType: type,
        launchId: launch.id,
        title: "Text context 1",
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

      const patchResponse = await client.patchTest({
        params: { id: test.id },
        body: patchRequest,
      });

      expect(patchResponse).toEqual({
        headers: expect.anything(),
        status: 200,
        body: {
          entityType: type,
          launchId: test.launchId,
          id: test.id,
          title: patchRequest.title,
          startedTimestamp: patchRequest.startedTimestamp.toISOString(),
          finishedTimestamp: patchRequest.finishedTimestamp.toISOString(),
          statusId: patchRequest.statusId,
          argumentsHash: test.argumentsHash,
          arguments: test.arguments,
          correlationId: test.correlationId,
          externalArgumentsHash: test.externalArgumentsHash,
        },
      });
    });
  }),
);
