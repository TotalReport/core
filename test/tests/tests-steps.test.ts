import { expect } from "earl";
import { describe, test } from "mocha";
import { TestsGenerator } from "../tools/test-generator.js";
import { client } from "../tools/client.js";
import "../tools/earl-extensions.js";

describe("test steps", () => {
  test("create test step", async () => {
    const test = await new TestsGenerator(client).create();
    const response = await client.createTestStep({
      body: {
        title: "Step 1",
        testId: test.id,
      },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 201,
      body: {
        id: expect.a(Number),
        title: "Step 1",
        createdTimestamp: expect.isCloseToNow(3000),
        testId: test.id,
      },
    });
  });
});
