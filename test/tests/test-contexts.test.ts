import { expect } from "earl";
import "../tools/earl-extensions.js";
import { describe, test } from "mocha";
import { client } from "../tools/client.js";
import { generateLaunch } from "../tools/launch-generator.js";
import { TestContextsGenerator } from "../tools/test-context-generator.js";

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

  test("create test context with all fields", async () => {
    const launch = await generateLaunch();
    const parentTestContext = await new TestContextsGenerator(client).create({
      launchId: launch.id,
    });
    const request = {
      launchId: launch.id,
      parentTestContextId: parentTestContext.id,
      title: "Test context 2",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
    };

    const response = await client.createTestContext({ body: request });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 201,
      body: {
        launchId: launch.id,
        parentTestContextId: parentTestContext.id,
        id: expect.a(Number),
        title: request.title,
        createdTimestamp: request.createdTimestamp.toISOString(),
        startedTimestamp: request.startedTimestamp.toISOString(),
        finishedTimestamp: request.finishedTimestamp.toISOString(),
      },
    });
  });

  test("read test context by id", async () => {
    const launch = await generateLaunch();
    const parentTestContext = await new TestContextsGenerator(client).create({
      launchId: launch.id,
    });
    const request = {
      launchId: launch.id,
      parentTestContextId: parentTestContext.id,
      title: "Test context 2",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
    };
    const testContext = await new TestContextsGenerator(client).create(request);

    const testContextByIdResponse = await client.readTestContext({
      params: { id: testContext.id },
    });

    expect(testContextByIdResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        launchId: launch.id,
        parentTestContextId: parentTestContext.id,
        id: testContext.id,
        title: request.title,
        createdTimestamp: request.createdTimestamp.toISOString(),
        startedTimestamp: request.startedTimestamp.toISOString(),
        finishedTimestamp: request.finishedTimestamp.toISOString(),
      },
    });
  });
});
