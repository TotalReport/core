import { expect } from "earl";
import "../tools/earl-extensions.js";
import { describe, test } from "mocha";
import { client } from "../tools/client.js";
import { generateLaunch } from "../tools/launch-generator.js";

describe("test contexts", () => {
  test("create test context", async () => {
    const launch = await generateLaunch();

    const response = await client.createTestContext({
      body: { title: "New test context", launchId: launch.id },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 201,
      body: {
        id: expect.a(Number),
        title: "New test context",
        launchId: launch.id,
        createdTimestamp: expect.isCloseToNow(3000),
      },
    });
  });
});
