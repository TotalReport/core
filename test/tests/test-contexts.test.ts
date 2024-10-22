import { LaunchesGenerator } from "@total-report/core-entities-generator/launch";
import { TestContextsGenerator } from "@total-report/core-entities-generator/test-context";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../tools/client.js";
import "../tools/earl-extensions.js";

describe("test contexts", () => {
  test("create test context with minimum fields", async () => {
    const launch = await new LaunchesGenerator(client).create();
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
    const launch = await new LaunchesGenerator(client).create();
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
    const launch = await new LaunchesGenerator(client).create();
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

  test("patch test context all fields", async () => {
    const parentTestContext = await new TestContextsGenerator(client).create();
    const testContext = await new TestContextsGenerator(client).create({
      launchId: parentTestContext.launchId,
      parentTestContextId: parentTestContext.id,
      title: "Text context 1",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
    });
    const patchRequest = {
      title: "Text context 2",
      createdTimestamp: new Date("2024-08-21T06:47:32Z"),
      startedTimestamp: new Date("2024-08-21T06:51:35Z"),
      finishedTimestamp: new Date("2024-08-21T06:52:21Z"),
    };

    const patchResponse = await client.patchTestContext({
      params: { id: testContext.id },
      body: patchRequest,
    });

    expect(patchResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        parentTestContextId: parentTestContext.id,
        launchId: testContext.launchId,
        id: testContext.id,
        title: patchRequest.title,
        createdTimestamp: patchRequest.createdTimestamp.toISOString(),
        startedTimestamp: patchRequest.startedTimestamp.toISOString(),
        finishedTimestamp: patchRequest.finishedTimestamp.toISOString(),
      },
    });
  });

  test("delete test context", async () => {
    const parentTestContext = await new TestContextsGenerator(client).create();
    const testContextToDelete = await new TestContextsGenerator(client).create({
      launchId: parentTestContext.launchId,
      parentTestContextId: parentTestContext.id,
    });

    const deleteTestContextResponse = await client.deleteTestContext({
      params: { id: testContextToDelete.id },
    });

    expect(deleteTestContextResponse).toEqual({
      headers: expect.anything(),
      status: 204,
      body: expect.a(Blob),
    });

    const testContextByIdAfterDeleteResponse = await client.readTestContext({
      params: { id: testContextToDelete.id },
    });

    expect(testContextByIdAfterDeleteResponse).toEqual({
      headers: expect.anything(),
      status: 404,
      body: {},
    });

    const parentTestContextByIdResponse = await client.readTestContext({
      params: { id: parentTestContext.id },
    });

    expect(parentTestContextByIdResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        ...parentTestContext,
      },
    });
  });
});
