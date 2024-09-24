import { expect } from "earl";
import { describe, test } from "mocha";
import { AfterTestsGenerator } from "../tools/after-test-generator.js";
import { client } from "../tools/client.js";
import "../tools/earl-extensions.js";

describe("after test steps", () => {
  test("create after test step", async () => {
    const afterTest = await new AfterTestsGenerator(client).create();
    const response = await client.createAfterTestStep({
      body: {
        title: "Step 1",
        afterTestId: afterTest.id,
      },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 201,
      body: {
        id: expect.a(Number),
        title: "Step 1",
        createdTimestamp: expect.isCloseToNow(3000),
        afterTestId: afterTest.id,
      },
    });
  });
});
