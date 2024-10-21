import { expect } from "earl";
import { describe, test } from "mocha";
import { BeforeTestsGenerator } from "../tools/before-test-generator.js";
import { client } from "../tools/client.js";
import "../tools/earl-extensions.js";
import { BeforeTestStepsGenerator } from "../tools/before-test-step-generator.js";

describe("before test steps", () => {
  test("create before test step", async () => {
    const beforeTest = await new BeforeTestsGenerator(client).create();
    const response = await client.createBeforeTestStep({
      body: {
        title: "Step 1",
        beforeTestId: beforeTest.id,
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
        beforeTestId: beforeTest.id,
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

  test("read before test step", async () => {
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

  test("patch before test step", async () => {
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

    const response = await client.patchBeforeTestStep({
      params: { id: beforeTestStep.id },
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
        beforeTestId: beforeTest.id,
        id: beforeTestStep.id,
        title: "Step 2",
        createdTimestamp: new Date("2024-07-21T06:53:32Z").toISOString(),
        startedTimestamp: new Date("2024-07-21T06:53:35Z").toISOString(),
        finishedTimestamp: new Date("2024-07-21T06:54:21Z").toISOString(),
        isSuccessful: true,
      },
    });
  });

  test("delete before test step", async () => {
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

    const response = await client.deleteBeforeTestStep({
      params: { id: beforeTestStep.id },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 204,
      body: expect.a(Blob),
    });

    const beforeTestStepByIdAfterDeleteResponse =
      await client.readBeforeTestStep({
        params: { id: beforeTestStep.id },
      });

    expect(beforeTestStepByIdAfterDeleteResponse).toEqual({
      headers: expect.anything(),
      status: 404,
      body: { message: "Before test step not found." },
    });
  });
});
