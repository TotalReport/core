import { TestsGenerator } from "@total-report/core-entities-generator/test";
import { TestStepsGenerator } from "@total-report/core-entities-generator/test-step";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";

const types: ("beforeTest" | "test" | "afterTest")[] = [
  "beforeTest",
  "test",
  "afterTest",
];

types.forEach((type: "beforeTest" | "test" | "afterTest") =>
  describe("delete " + type + " step", () => {
    test("by id", async () => {
      const test = await new TestsGenerator(client).create({
        entityType: type,
      });
      const testStep = await new TestStepsGenerator(client).create({
        testId: test.id,
        title: "Step 1",
        startedTimestamp: new Date("2024-07-21T06:52:35Z"),
        finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
        isSuccessful: false,
        errorMessage: "Error message 1",
      });

      const response = await client.deleteTestStep({
        params: { id: testStep.id },
      });

      expect(response).toEqual({
        headers: expect.anything(),
        status: 204,
        body: expect.a(Blob),
      });

      const testStepByIdAfterDeleteResponse = await client.readTestStep({
        params: { id: testStep.id },
      });

      expect(testStepByIdAfterDeleteResponse).toEqual({
        headers: expect.anything(),
        status: 404,
        body: { message: "Test step not found." },
      });
    });
  }),
);
