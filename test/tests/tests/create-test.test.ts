import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { DEFAULT_TEST_STATUSES } from "@total-report/core-schema/constants";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";

const generator = new CoreEntititesGenerator(client);

describe("create test", () => {
  test("with minimum fields", async () => {
    const launch = await generator.launches.create();
    const request = { title: "New test", launchId: launch.id };

    const response = await client.createTest({ body: request });

    expect(response).toEqual({
      status: 201,
      headers: expect.anything(),
      body: {
        id: expect.a(Number),
        title: request.title,
        createdTimestamp: expect.isCloseToNow(3000),
        launchId: launch.id,
        argumentsHash: "bbb93ef2-6e3c-101f-f11c-dd21cab08a94",
        correlationId: "bbb93ef2-6e3c-101f-f11c-dd21cab08a94",
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

    const response = await client.createTest({ body: request });

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

  test("with arguments, but without argumentsHash", async () => {
    const launch = await generator.launches.create();
    const request = {
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
    };

    const response = await client.createTest(request);

    expect(response).toEqual({
      status: 201,
      headers: expect.anything(),
      body: {
        id: expect.a(Number),
        title: "New test",
        createdTimestamp: expect.isCloseToNow(3000),
        launchId: launch.id,
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
        argumentsHash: "d5a4cc62-597d-4a85-6860-b5cbea7b529e",
        correlationId: "bbb93ef2-6e3c-101f-f11c-dd21cab08a94",
      },
    });
  });

  test("arguments hash is same for same arguments", async () => {
    const testsGenerator = generator.tests;
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
    const testsGenerator = generator.tests;
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
});
