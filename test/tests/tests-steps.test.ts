import { expect } from "earl";
import { describe, test } from "mocha";
import { TestsGenerator } from "../tools/test-generator.js";
import { client } from "../tools/client.js";
import "../tools/earl-extensions.js";
import { TestStepsGenerator } from "../tools/test-step-generator.js";

describe("test steps", () => {
  test("create test step", async () => {
    const test = await new TestsGenerator(client).create();
    const response = await client.createTestStep({
      body: {
        title: "Step 1",
        testId: test.id,
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
        testId: test.id,
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

  test("read test step", async () => {
    const test = await new TestsGenerator(client).create();
    const testStep = await new TestStepsGenerator(client).create({
      testId: test.id,
      title: "Step 1",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
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
        createdTimestamp: testStep.createdTimestamp,
        startedTimestamp: testStep.startedTimestamp,
        finishedTimestamp: testStep.finishedTimestamp,
        isSuccessful: testStep.isSuccessful,
        errorMessage: testStep.errorMessage,
      },
    });
  });

  test("patch test step", async () => {
    const test = await new TestsGenerator(client).create();
    const testStep = await new TestStepsGenerator(client).create({
      testId: test.id,
      title: "Step 1",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
      isSuccessful: false,
      errorMessage: "Error message 1",
    });

    const response = await client.patchTestStep({
      params: { id: testStep.id },
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
        testId: test.id,
        id: testStep.id,
        title: "Step 2",
        createdTimestamp: new Date("2024-07-21T06:53:32Z").toISOString(),
        startedTimestamp: new Date("2024-07-21T06:53:35Z").toISOString(),
        finishedTimestamp: new Date("2024-07-21T06:54:21Z").toISOString(),
        isSuccessful: true,
      },
    });
  });

  test("delete test step", async () => {
    const test = await new TestsGenerator(client).create();
    const testStep = await new TestStepsGenerator(client).create({
      testId: test.id,
      title: "Step 1",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
      isSuccessful: false,
      errorMessage: "Error message 1",
    });

    const response = await client.deleteTestStep({
      params: { id: testStep.id },
      body: undefined,
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
      body: {message: "Test step not found."},
    });
  });
});
