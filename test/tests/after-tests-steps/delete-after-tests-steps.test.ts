import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";

const generator = new CoreEntititesGenerator(client);

describe("delete after test step", () => {
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

    const response = await client.deleteAfterTestStep({
      params: { id: afterTestStep.id },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 204,
      body: expect.a(Blob),
    });

    const afterTestStepByIdAfterDeleteResponse = await client.readAfterTestStep(
      {
        params: { id: afterTestStep.id },
      }
    );

    expect(afterTestStepByIdAfterDeleteResponse).toEqual({
      headers: expect.anything(),
      status: 404,
      body: { message: "After test step not found." },
    });
  });
});
