import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";

const generator = new CoreEntititesGenerator(client);

describe("read before test step", () => {
  test("by id", async () => {
    const beforeTest = await generator.beforeTests.create();
    const beforeTestStep = await generator.beforeTestSteps.create({
      beforeTestId: beforeTest.id,
      title: "Step 1",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
      isSuccessful: false,
      errorMessage: "Error message 1",
    });

    const response = await client.readBeforeTestStep({
      params: { id: beforeTestStep.id },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        beforeTestId: beforeTest.id,
        id: beforeTestStep.id,
        title: beforeTestStep.title,
        createdTimestamp: beforeTestStep.createdTimestamp,
        startedTimestamp: beforeTestStep.startedTimestamp,
        finishedTimestamp: beforeTestStep.finishedTimestamp,
        isSuccessful: beforeTestStep.isSuccessful,
        errorMessage: beforeTestStep.errorMessage,
      },
    });
  });

  test("by beforeTestId", async () => {
    const beforeTest1 = await generator.beforeTests.create();
    const beforeTest2 = await generator.beforeTests.create();
    const step11 = await generator.beforeTestSteps.create({
      beforeTestId: beforeTest1.id,
      title: "Step 11",
    });
    const step21 = await generator.beforeTestSteps.create({
      beforeTestId: beforeTest2.id,
      title: "Step 21",
    });
    const step22 = await generator.beforeTestSteps.create({
      beforeTestId: beforeTest2.id,
      title: "Step 22",
    });

    const response = await client.findBeforeTestSteps({
      query: { beforeTestId: beforeTest2.id },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: [step21, step22],
    });
  });
});
