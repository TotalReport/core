import { expect } from "earl";
import "../tools/earl-extensions.js";
import { describe, test } from "mocha";
import { client } from "../tools/client.js";
import { generateLaunch } from "../tools/launch-generator.js";

describe("test contexts", () => {
  test("create test context with minimum fields", async () => {
    const launch = await generateLaunch();
    const request = {
      title: "New test context",
      launchId: launch.id,
    };

    const response = await client.createTestContext({
      body: request,
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 201,
      body: {
        id: expect.a(Number),
        title: request.title,
        launchId: launch.id,
        createdTimestamp: expect.isCloseToNow(3000),
      },
    });
  });
});
