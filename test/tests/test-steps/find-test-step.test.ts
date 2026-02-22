import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
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
  describe("read " + type + " step", () => {
    test("by id", async () => {
      const test = await generator.tests.create({
        entityType: type,
      });
      const testStep = await generator.testSteps.create({
        testId: test.id,
        title: "Step 1",
        startedTimestamp: new Date("2024-07-21T06:52:35Z"),
        finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
        isSuccessful: false,
        errorMessage: "Error message 1",
      });

      const response = await client.readTestStep({
        params: { id: testStep.id },
      });

      expect(response).toEqual({
        headers: expect.anything(),
        status: 200,
        body: {
          testId: test.id,
          id: testStep.id,
          title: testStep.title,
          startedTimestamp: testStep.startedTimestamp,
          finishedTimestamp: testStep.finishedTimestamp,
          isSuccessful: testStep.isSuccessful,
          errorMessage: testStep.errorMessage,
        },
      });
    });

    test("by testId", async () => {
      const test1 = await generator.tests.create({ entityType: type });
      const test2 = await generator.tests.create({ entityType: type });
      const step11 = await generator.testSteps.create({
        testId: test1.id,
        title: "Step 1",
      });
      const step21 = await generator.testSteps.create({
        testId: test2.id,
        title: "Step 2",
      });
      const step22 = await generator.testSteps.create({
        testId: test2.id,
        title: "Step 3",
      });

      const response = await client.findTestSteps({
        query: { testId: test2.id },
      });

      expect(response).toEqual({
        headers: expect.anything(),
        status: 200,
        body: [step21, step22],
      });
    });
  }),
);
