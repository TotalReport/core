import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";

const generator = new CoreEntititesGenerator(client);

describe("find test steps", () => {
  test("by id", async () => {
    const afterTest = await generator.afterTests.create();
    const afterTestStep = await generator.afterTestSteps.create({
      afterTestId: afterTest.id,
      title: "Step 1",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
      isSuccessful: false,
      errorMessage: "Error message 1",
    });

    const response = await client.readAfterTestStep({
      params: { id: afterTestStep.id },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        afterTestId: afterTest.id,
        id: afterTestStep.id,
        title: afterTestStep.title,
        createdTimestamp: afterTestStep.createdTimestamp,
        startedTimestamp: afterTestStep.startedTimestamp,
        finishedTimestamp: afterTestStep.finishedTimestamp,
        isSuccessful: afterTestStep.isSuccessful,
        errorMessage: afterTestStep.errorMessage,
      },
    });
  });
});
