import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { DEFAULT_TEST_STATUSES } from "@total-report/core-schema/constants";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import { expect_toBe } from "../../tools/utils.js";

const generator = new CoreEntititesGenerator(client);

describe("create before test", () => {
  test("with minimum fields", async () => {
    const launch = await generator.launches.create();
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
        argumentsHash: "d5a4cc62-597d-4a85-6860-b5cbea7b529e",
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
        correlationId: "167e3735-1f27-5320-e63b-7f08e6e506d3",
      },
    });
  });

  test("with all fields", async () => {
    const launch = await generator.launches.create();
    const context = await generator.contexts.create({ launchId: launch.id });
    const request = {
      launchId: launch.id,
      title: "New test",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
      statusId: DEFAULT_TEST_STATUSES.PASSED.id,
      testContextId: context.id,
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
      correlationId: "bbb93ef2-6e3c-101f-f11c-dd21cab08a95",
      argumentsHash: "bbb93ef2-6e3c-101f-f11c-dd21cab08a96",
    };

    const response = await client.createBeforeTest({ body: request });

    expect(response).toEqual({
      status: 201,
      headers: expect.anything(),
      body: {
        id: expect.a(Number),
        title: request.title,
        createdTimestamp: request.createdTimestamp.toISOString(),
        startedTimestamp: request.startedTimestamp.toISOString(),
        finishedTimestamp: request.finishedTimestamp.toISOString(),
        statusId: request.statusId,
        launchId: launch.id,
        testContextId: context.id,
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
        argumentsHash: request.argumentsHash,
        correlationId: request.correlationId,
      },
    });
  });

  test("correlationId is different for different names if not provided", async () => {
    const launch = await generator.launches.create();

    const beforeTest1 = await client.createBeforeTest({
      body: {
        title: "Test1",
        launchId: launch.id,
      },
    });

    expect_toBe(beforeTest1.status, 201);

    const beforeTest2 = await client.createBeforeTest({
      body: {
        title: "Test2",
        launchId: launch.id,
      },
    });

    expect_toBe(beforeTest2.status, 201);

    expect(beforeTest1.body.correlationId).not.toEqual(
      beforeTest2.body.correlationId
    );
  });

  test("arguments hash is same for same arguments", async () => {
    const beforeTestsGenerator = generator.beforeTests;
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
    const beforeTestsGenerator = generator.beforeTests;
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
});
