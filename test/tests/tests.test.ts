import { expect } from "earl";
import "../tools/earl-extensions.js";
import { describe, test } from "mocha";
import { client } from "../tools/client.js";
import { generateLaunch } from "../tools/launch-generator.js";
import { TestsGenerator } from "../tools/test-generator.js";
import { TestContextsGenerator } from "../tools/test-context-generator.js";
import { DEFAULT_TEST_STATUSES } from "@total-report/core-schema/constants";

describe("tests", () => {
  test("create test", async () => {
    const launch = await generateLaunch();
    const response = await client.createTest({
      body: {
        title: "New test",
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
        title: "New test",
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
    const testsGenerator = new TestsGenerator(client);
    const testsArguments = [
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

    const first = await testsGenerator.create({
      arguments: testsArguments,
    });
    const second = await testsGenerator.create({
      arguments: testsArguments,
    });

    expect(first.arguments?.map((arg) => arg.id)).not.toEqual(
      second.arguments?.map((arg) => arg.id)
    );

    expect(first.argumentsHash).toEqual(second.argumentsHash);
  });

  test("arguments hash is different for different arguments", async () => {
    const testsGenerator = new TestsGenerator(client);
    const testsArguments1 = [
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

    const testsArguments2 = [
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

    const first = await testsGenerator.create({
      arguments: testsArguments1,
    });
    const second = await testsGenerator.create({
      arguments: testsArguments2,
    });

    expect(first.arguments?.map((arg) => arg.id)).not.toEqual(
      second.arguments?.map((arg) => arg.id)
    );

    expect(first.argumentsHash).not.toEqual(second.argumentsHash);
  });

  test("read test", async () => {
    const launch = await generateLaunch();
    const testContext = await new TestContextsGenerator(client).create({
      launchId: launch.id,
    });
    const created = await new TestsGenerator(client).create({
      testContextId: testContext.id,
      title: "New test",
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

    const response = await client.readTest({
      params: { id: created.id },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: created,
    });
  });

  test("patch test all fields", async () => {
    const testContext = await new TestContextsGenerator(client).create();
    const test = await new TestsGenerator(client).create({
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

    const patchResponse = await client.patchTest({
      params: { id: test.id },
      body: patchRequest,
    });

    expect(patchResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        testContextId: testContext.id,
        launchId: test.launchId,
        id: test.id,
        title: patchRequest.title,
        createdTimestamp: patchRequest.createdTimestamp.toISOString(),
        startedTimestamp: patchRequest.startedTimestamp.toISOString(),
        finishedTimestamp: patchRequest.finishedTimestamp.toISOString(),
        statusId: patchRequest.statusId,
        argumentsHash: test.argumentsHash,
        arguments: test.arguments,
      },
    });
  });

  test("delete test", async () => {
    const launch = await generateLaunch();

    const testContext = await new TestContextsGenerator(client).create({
      launchId: launch.id,
    });

    const test = await new TestsGenerator(client).create({
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

    const deleteTestResponse = await client.deleteTest({
      params: { id: test.id },
      body: undefined,
    });

    expect(deleteTestResponse).toEqual({
      headers: expect.anything(),
      status: 204,
      body: expect.a(Blob),
    });

    const testByIdAfterDeleteResponse = await client.readTest({
      params: { id: test.id },
    });

    expect(testByIdAfterDeleteResponse).toEqual({
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
      params: { id: test.launchId },
    });

    expect(launchByIdAfterDeleteResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: launch,
    });
  });
});
