import { BeforeTestsGenerator } from "@total-report/core-entities-generator/before-test";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";

describe("create before test step", () => {
  test("with all fields", async () => {
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
        process: "Process 1",
        thread: "Thread 1",
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
        process: "Process 1",
        thread: "Thread 1",
      },
    });
  });

  test("with minimum fields", async () => {
    const beforeTest = await new BeforeTestsGenerator(client).create();
    const response = await client.createBeforeTestStep({
      body: {
        title: "Step 1",
        beforeTestId: beforeTest.id,
      },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 201,
      body: {
        beforeTestId: beforeTest.id,
        id: expect.a(Number),
        title: "Step 1",
        createdTimestamp: expect.isCloseToNow(3000),
      },
    });
  });
});
