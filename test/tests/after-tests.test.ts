import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../tools/client.js";
import { generateLaunch } from "../tools/launch-generator.js";
import { AfterTestsGenerator } from "../tools/after-test-generator.js";
import { TestContextsGenerator } from "../tools/test-context-generator.js";
import { DEFAULT_TEST_STATUSES } from "@total-report/core-schema/constants";

describe("after tests", () => {
  test("create after test", async () => {
    const launch = await generateLaunch();
    const response = await client.createAfterTest({
      body: {
        title: "New after test",
        launchId: launch.id,
        arguments: [
          {
            name: "Argument1",
            type: "String",
            value: "value1",
          },
          {
            name: "Argument2",
            type: "Integer",
            value: "value2",
          },
        ],
      },
    });

    expect(response).toEqual({
      status: 201,
      headers: expect.anything(),
      body: {
        id: expect.a(Number),
        title: "New after test",
        createdTimestamp: expect.isCloseToNow(3000),
        launchId: launch.id,
        argumentsHash: expect.a(String),
        arguments: [
          {
            id: expect.a(Number),
            name: "Argument1",
            type: "String",
            value: "value1",
          },
          {
            id: expect.a(Number),
            name: "Argument2",
            type: "Integer",
            value: "value2",
          },
        ],
      },
    });
  });

  test("arguments hash is same for same arguments", async () => {
    const afterTestsGenerator = new AfterTestsGenerator(client);
    const afterTestsArguments = [
      {
        name: "Argument1",
        type: "String",
        value: "value1",
      },
      {
        name: "Argument2",
        type: "Integer",
        value: "value2",
      },
    ];

    const first = await afterTestsGenerator.create({
      arguments: afterTestsArguments,
    });
    const second = await afterTestsGenerator.create({
      arguments: afterTestsArguments,
    });

    expect(first.arguments?.map((arg) => arg.id)).not.toEqual(
      second.arguments?.map((arg) => arg.id)
    );

    expect(first.argumentsHash).toEqual(second.argumentsHash);
  });

  test("arguments hash is different for different arguments", async () => {
    const afterTestsGenerator = new AfterTestsGenerator(client);
    const afterTestsArguments1 = [
      {
        name: "Argument1",
        type: "String",
        value: "value1",
      },
      {
        name: "Argument2",
        type: "Integer",
        value: "value2",
      },
    ];

    const afterTestsArguments2 = [
      {
        name: "Argument1",
        type: "String",
        value: "value1",
      },
      {
        name: "Argument3",
        type: "Integer",
        value: "value2",
      },
    ];

    const first = await afterTestsGenerator.create({
      arguments: afterTestsArguments1,
    });
    const second = await afterTestsGenerator.create({
      arguments: afterTestsArguments2,
    });

    expect(first.arguments?.map((arg) => arg.id)).not.toEqual(
      second.arguments?.map((arg) => arg.id)
    );

    expect(first.argumentsHash).not.toEqual(second.argumentsHash);
  });

  test("read after test", async () => {
    const launch = await generateLaunch();
    const testContext = await new TestContextsGenerator(client).create({
      launchId: launch.id,
    });
    const created = await new AfterTestsGenerator(client).create({
      testContextId: testContext.id,
      title: "New after test",
      launchId: launch.id,
      arguments: [
        {
          name: "Argument1",
          type: "String",
          value: "value1",
        },
        {
          name: "Argument2",
          type: "Integer",
          value: "value2",
        },
      ],
    });

    const response = await client.readAfterTest({
      params: { id: created.id },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: created,
    });
  });

  test("patch after test all fields", async () => {
    const testContext = await new TestContextsGenerator(client).create();
    const afterTest = await new AfterTestsGenerator(client).create({
      launchId: testContext.launchId,
      testContextId: testContext.id,
      title: "Text context 1",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
      statusId: DEFAULT_TEST_STATUSES.SUCCESSFUL.id,
      arguments: [
        {
          name: "Argument1",
          type: "String",
          value: "value1",
        },
        {
          name: "Argument2",
          type: "Integer",
          value: "value2",
        },
      ],
    });
    const patchRequest = {
      title: "Text context 2",
      createdTimestamp: new Date("2024-08-21T06:47:32Z"),
      startedTimestamp: new Date("2024-08-21T06:51:35Z"),
      finishedTimestamp: new Date("2024-08-21T06:52:21Z"),
      statusId: DEFAULT_TEST_STATUSES.PRODUCT_BUG.id,
    };

    const patchResponse = await client.patchAfterTest({
      params: { id: afterTest.id },
      body: patchRequest,
    });

    expect(patchResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        testContextId: testContext.id,
        launchId: afterTest.launchId,
        id: afterTest.id,
        title: patchRequest.title,
        createdTimestamp: patchRequest.createdTimestamp.toISOString(),
        startedTimestamp: patchRequest.startedTimestamp.toISOString(),
        finishedTimestamp: patchRequest.finishedTimestamp.toISOString(),
        statusId: patchRequest.statusId,
        argumentsHash: afterTest.argumentsHash,
        arguments: afterTest.arguments,
      },
    });
  });

  test("delete after test", async () => {
    const launch = await generateLaunch();
    const testContext = await new TestContextsGenerator(client).create({
      launchId: launch.id,
    });
    const afterTest = await new AfterTestsGenerator(client).create({
      launchId: launch.id,
      testContextId: testContext.id,
      title: "Text context 1",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
      statusId: DEFAULT_TEST_STATUSES.SUCCESSFUL.id,
      arguments: [
        {
          name: "Argument1",
          type: "String",
          value: "value1",
        },
        {
          name: "Argument2",
          type: "Integer",
          value: "value2",
        },
      ],
    });

    const deleteLaunchResponse = await client.deleteAfterTest({
      params: { id: afterTest.id },
    });

    expect(deleteLaunchResponse).toEqual({
      headers: expect.anything(),
      status: 204,
      body: expect.a(Blob),
    });

    const afterTestByIdAfterDeleteResponse = await client.readAfterTest({
      params: { id: afterTest.id },
    });

    expect(afterTestByIdAfterDeleteResponse).toEqual({
      headers: expect.anything(),
      status: 404,
      body: {},
    });

    const testContextByIdAfterDeleteResponse = await client.readTestContext({
      params: { id: testContext.id },
    });

    expect(testContextByIdAfterDeleteResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: testContext,
    });

    const launchByIdAfterDeleteResponse = await client.readLaunch({
      params: { id: afterTest.launchId },
    });

    expect(launchByIdAfterDeleteResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: launch,
    });
  });
});
