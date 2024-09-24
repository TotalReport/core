import { expect } from "earl";
import { describe, test } from "mocha";
import { BeforeTestsGenerator } from "../tools/before-test-generator.js";
import { client } from "../tools/client.js";
import "../tools/earl-extensions.js";

describe("before test steps", () => {
  test("create before test step", async () => {
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
        id: expect.a(Number),
        title: "Step 1",
        createdTimestamp: expect.isCloseToNow(3000),
        beforeTestId: beforeTest.id,
      },
    });
  });
});
