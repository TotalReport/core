import { TestsGenerator } from "@total-report/core-entities-generator/test";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";

const types: ("beforeTest" | "test" | "afterTest")[] = [
  "beforeTest",
  "test",
  "afterTest",
];

types.forEach((type: "beforeTest" | "test" | "afterTest") =>
  describe("create " + type + " step", () => {
    test("with all fields", async () => {
      const test = await new TestsGenerator(client).create({
        entityType: type,
      });
      const response = await client.createTestStep({
        body: {
          title: "Step 1",
          testId: test.id,
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
          testId: test.id,
          id: expect.a(Number),
          title: "Step 1",
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
      const test = await new TestsGenerator(client).create({
        entityType: type,
      });
      const response = await client.createTestStep({
        body: {
          startedTimestamp: new Date("2024-07-21T06:52:35Z"),
          title: "Step 1",
          testId: test.id,
        },
      });

      expect(response).toEqual({
        headers: expect.anything(),
        status: 201,
        body: {
          testId: test.id,
          id: expect.a(Number),
          title: "Step 1",
          startedTimestamp: new Date("2024-07-21T06:52:35Z").toISOString(),
        },
      });
    });
  }),
);
