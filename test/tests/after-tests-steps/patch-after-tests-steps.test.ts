import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";

const generator = new CoreEntititesGenerator(client);

describe("patch after test steps", () => {
  test("with all fields", async () => {
    const afterTest = await generator.afterTests.create();
    const afterTestStep = await generator.afterTestSteps.create({
      afterTestId: afterTest.id,
      title: "Step 1",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
      isSuccessful: false,
      errorMessage: "Error message 1",
      process: "Process 1",
      thread: "Thread 1",
    });

    const response = await client.patchAfterTestStep({
      params: { id: afterTestStep.id },
      body: {
        title: "Step 2",
        createdTimestamp: new Date("2024-07-21T06:53:32Z"),
        startedTimestamp: new Date("2024-07-21T06:53:35Z"),
        finishedTimestamp: new Date("2024-07-21T06:54:21Z"),
        isSuccessful: true,
        errorMessage: null,
        process: null,
        thread: null,
      },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        afterTestId: afterTest.id,
        id: afterTestStep.id,
        title: "Step 2",
        createdTimestamp: new Date("2024-07-21T06:53:32Z").toISOString(),
        startedTimestamp: new Date("2024-07-21T06:53:35Z").toISOString(),
        finishedTimestamp: new Date("2024-07-21T06:54:21Z").toISOString(),
        isSuccessful: true,
      },
    });
  });
});
