import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../tools/client.js";
import { generateLaunch } from "../tools/launch-generator.js";
import { BeforeTestsGenerator } from "../tools/before-test-generator.js";
import { TestContextsGenerator } from "../tools/test-context-generator.js";
import { DEFAULT_TEST_STATUSES } from "@total-report/core-schema/constants";

describe("before tests", () => {
  test("create before test", async () => {
    const launch = await generateLaunch();
    const response = await client.createBeforeTest({
      body: {
        title: "New before test",
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
        title: "New before test",
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
    const beforeTestsGenerator = new BeforeTestsGenerator(client);
    const beforeTestsArguments = [
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

    const first = await beforeTestsGenerator.create({
      arguments: beforeTestsArguments,
    });
    const second = await beforeTestsGenerator.create({
      arguments: beforeTestsArguments,
    });

    expect(first.arguments?.map((arg) => arg.id)).not.toEqual(
      second.arguments?.map((arg) => arg.id)
    );

    expect(first.argumentsHash).toEqual(second.argumentsHash);
  });

  test("arguments hash is different for different arguments", async () => {
    const beforeTestsGenerator = new BeforeTestsGenerator(client);
    const beforeTestsArguments1 = [
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

    const beforeTestsArguments2 = [
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

    const first = await beforeTestsGenerator.create({
      arguments: beforeTestsArguments1,
    });
    const second = await beforeTestsGenerator.create({
      arguments: beforeTestsArguments2,
    });

    expect(first.arguments?.map((arg) => arg.id)).not.toEqual(
      second.arguments?.map((arg) => arg.id)
    );

    expect(first.argumentsHash).not.toEqual(second.argumentsHash);
  });

  test("read before test", async () => {
    const launch = await generateLaunch();
    const testContext = await new TestContextsGenerator(client).create({
      launchId: launch.id,
    });
    const created = await new BeforeTestsGenerator(client).create({
      testContextId: testContext.id,
      title: "New before test",
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

    const response = await client.readBeforeTest({
      params: { id: created.id },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: created,
    });
  });

  test("patch before test all fields", async () => {
    const testContext = await new TestContextsGenerator(client).create();
    const beforeTest = await new BeforeTestsGenerator(client).create({
      launchId: testContext.launchId,
      testContextId: testContext.id,
      title: "Text context 1",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
      statusId: DEFAULT_TEST_STATUSES.SUCCESS.id,
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

    const patchResponse = await client.patchBeforeTest({
      params: { id: beforeTest.id },
      body: patchRequest,
    });

    expect(patchResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        testContextId: testContext.id,
        launchId: beforeTest.launchId,
        id: beforeTest.id,
        title: patchRequest.title,
        createdTimestamp: patchRequest.createdTimestamp.toISOString(),
        startedTimestamp: patchRequest.startedTimestamp.toISOString(),
        finishedTimestamp: patchRequest.finishedTimestamp.toISOString(),
        statusId: patchRequest.statusId,
        argumentsHash: beforeTest.argumentsHash,
        arguments: beforeTest.arguments,
      },
    });
  });

  test("delete before test", async () => {
    const launch = await generateLaunch();
    const testContext = await new TestContextsGenerator(client).create({
      launchId: launch.id,
    });
    const beforeTest = await new BeforeTestsGenerator(client).create({
      launchId: launch.id,
      testContextId: testContext.id,
      title: "Text context 1",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
      statusId: DEFAULT_TEST_STATUSES.SUCCESS.id,
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

    const deleteLaunchResponse = await client.deleteBeforeTest({
      params: { id: beforeTest.id },
      body: undefined,
    });

    expect(deleteLaunchResponse).toEqual({
      headers: expect.anything(),
      status: 204,
      body: expect.a(Blob),
    });

    const beforeTestByIdAfterDeleteResponse = await client.readBeforeTest({
      params: { id: beforeTest.id },
    });

    expect(beforeTestByIdAfterDeleteResponse).toEqual({
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
      params: { id: beforeTest.launchId },
    });

    expect(launchByIdAfterDeleteResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: launch,
    });
  });
});
