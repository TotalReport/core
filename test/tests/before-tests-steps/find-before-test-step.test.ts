import { BeforeTestsGenerator } from "@total-report/core-entities-generator/before-test";
import { BeforeTestStepsGenerator } from "@total-report/core-entities-generator/before-test-step";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";

describe("read before test step", () => {
  test("by id", async () => {
    const beforeTest = await new BeforeTestsGenerator(client).create();
    const beforeTestStep = await new BeforeTestStepsGenerator(client).create({
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
});
