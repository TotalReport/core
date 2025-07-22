import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { DEFAULT_TEST_STATUSES } from "@total-report/core-schema/constants";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import { expect_toBe } from "../../tools/utils.js";

const generator = new CoreEntititesGenerator(client);

describe("create after test", () => {
  test("with minimum fields", async () => {
    const launch = await generator.launches.create();
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
        correlationId: "a17344f5-c71c-6cd7-4268-98071ec3d57a",
        externalArgumentsHash: "bbb93ef2-6e3c-101f-f11c-dd21cab08a94",
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
      externalArgumentsHash: "d27fca0d-e829-417a-9d1d-8f838c1e088f",
    };

    const response = await client.createAfterTest({ body: request });

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
        externalArgumentsHash: request.externalArgumentsHash,
      },
    });
  });

  test("correlationId is different for different names if not provided", async () => {
    const launch = await generator.launches.create();
    
    const afterTest1 = await client.createAfterTest(
      {
        body: {
          title: "Test1",
          launchId: launch.id,
        }
      }
    );

    expect_toBe(afterTest1.status, 201);
    
    const afterTest2 = await client.createAfterTest(
      {
        body: {
          title: "Test2",
          launchId: launch.id,
        }
      }
    );

    expect_toBe(afterTest2.status, 201);

    expect(afterTest1.body.correlationId).not.toEqual(afterTest2.body.correlationId);
  });

  test("arguments hash is same for same arguments", async () => {
    const afterTestsGenerator = generator.afterTests;
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
    const afterTestsGenerator = generator.afterTests;
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
});
