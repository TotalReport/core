import { AfterTestsGenerator } from "@total-report/core-entities-generator/after-test";
import { AfterTestStepsGenerator } from "@total-report/core-entities-generator/after-test-step";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../tools/client.js";
import "../tools/earl-extensions.js";

describe("after test steps", () => {
  test("create after test step", async () => {
    const afterTest = await new AfterTestsGenerator(client).create();
    const response = await client.createAfterTestStep({
      body: {
        title: "Step 1",
        afterTestId: afterTest.id,
        createdTimestamp: new Date("2024-07-21T06:52:32Z"),
        startedTimestamp: new Date("2024-07-21T06:52:35Z"),
        finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
        isSuccessful: false,
        errorMessage: "Error message 1",
      },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 201,
      body: {
        afterTestId: afterTest.id,
        id: expect.a(Number),
        title: "Step 1",
        createdTimestamp: new Date("2024-07-21T06:52:32Z").toISOString(),
        startedTimestamp: new Date("2024-07-21T06:52:35Z").toISOString(),
        finishedTimestamp: new Date("2024-07-21T06:53:21Z").toISOString(),
        isSuccessful: false,
        errorMessage: "Error message 1",
      },
    });
  });

  test("read after test step", async () => {
    const afterTest = await new AfterTestsGenerator(client).create();
    const afterTestStep = await new AfterTestStepsGenerator(client).create({
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

  test("patch after test step", async () => {
    const afterTest = await new AfterTestsGenerator(client).create();
    const afterTestStep = await new AfterTestStepsGenerator(client).create({
      afterTestId: afterTest.id,
      title: "Step 1",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
      isSuccessful: false,
      errorMessage: "Error message 1",
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

  test("delete after test step", async () => {
    const afterTest = await new AfterTestsGenerator(client).create();
    const afterTestStep = await new AfterTestStepsGenerator(client).create({
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
