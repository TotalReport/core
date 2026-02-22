import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { DEFAULT_TEST_STATUSES } from "@total-report/core-schema/constants";
import { contract } from "@total-report/core-contract/contract";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";
import { expect_toBe } from "../../tools/utils.js";
import { RemoveNullishProps } from "../../tools/utils.js";
import { ClientInferRequest } from "@ts-rest/core";

const generator = new CoreEntititesGenerator(client);
const types: ("beforeTest" | "test" | "afterTest")[] = [
  "beforeTest",
  "test",
  "afterTest",
];

types.forEach((type: "beforeTest" | "test" | "afterTest") =>
  describe(`create ${type}`, () => {
    test("with minimum fields", async () => {
      const launch = await generator.launches.create();
      const request: CreateTestRequestBodyRequiredFields = {
        title: "New test",
        launchId: launch.id,
        startedTimestamp: new Date("2024-07-21T06:52:32Z"),
        entityType: type,
      };

      const response = await client.createTest({ body: request });

      expect(response).toEqual({
        status: 201,
        headers: expect.anything(),
        body: {
          id: expect.a(Number),
          entityType: type,
          title: request.title,
          startedTimestamp: request.startedTimestamp.toISOString(),
          launchId: launch.id,
          argumentsHash: "bbb93ef2-6e3c-101f-f11c-dd21cab08a94",
          correlationId: "a82e0cae-7b09-c036-14ef-82daed8fa042",
          externalArgumentsHash: "bbb93ef2-6e3c-101f-f11c-dd21cab08a94",
        },
      });
    });

    test("with all fields", async () => {
      const launch = await generator.launches.create();
      const request: CreateTestRequestBodyAllFieldsRequired = {
        launchId: launch.id,
        entityType: type,
        title: "New test",
        startedTimestamp: new Date("2024-07-21T06:52:32Z"),
        finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
        statusId: DEFAULT_TEST_STATUSES.PASSED.id,
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
        externalArguments: [
          {
            name: "ExternalArgument1",
            type: "String",
            value: "value1",
          },
          {
            name: "ExternalArgument2",
            type: "Integer",
            value: "value2",
          },
        ],
        correlationId: "bbb93ef2-6e3c-101f-f11c-dd21cab08a95",
        argumentsHash: "bbb93ef2-6e3c-101f-f11c-dd21cab08a96",
        externalArgumentsHash: "bbb93ef2-6e3c-101f-f11c-dd21cab08a94",
      };

      const response = await client.createTest({ body: request });

      expect(response).toEqual({
        status: 201,
        headers: expect.anything(),
        body: {
          id: expect.a(Number),
          entityType: type,
          title: request.title,
          startedTimestamp: request.startedTimestamp.toISOString(),
          finishedTimestamp: request.finishedTimestamp.toISOString(),
          statusId: request.statusId,
          launchId: launch.id,
          arguments: request.arguments,
          externalArguments: request.externalArguments,
          argumentsHash: request.argumentsHash,
          correlationId: request.correlationId,
          externalArgumentsHash: request.externalArgumentsHash,
        },
      });
    });

    test("correlationId is different for different names if not provided", async () => {
      const launch = await generator.launches.create();

      const test1 = await client.createTest({
        body: {
          entityType: type,
          title: "Test1",
          launchId: launch.id,
          startedTimestamp: new Date("2024-07-21T06:52:32Z"),
        },
      });

      expect_toBe(test1.status, 201);

      const test2 = await client.createTest({
        body: {
          entityType: type,
          title: "Test2",
          launchId: launch.id,
          startedTimestamp: new Date("2024-07-21T06:52:32Z"),
        },
      });

      expect_toBe(test2.status, 201);

      expect(test1.body.correlationId).not.toEqual(test2.body.correlationId);
    });

    test("with arguments, but without argumentsHash", async () => {
      const launch = await generator.launches.create();
      const request: CreateTestRequestBody = {
        title: "New test",
        entityType: type,
        startedTimestamp: new Date("2024-07-21T06:52:32Z"),
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
      };

      const response = await client.createTest({ body: request });

      expect(response).toEqual({
        status: 201,
        headers: expect.anything(),
        body: {
          id: expect.a(Number),
          entityType: type,
          title: "New test",
          startedTimestamp: request.startedTimestamp.toISOString(),
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
          argumentsHash: "d5a4cc62-597d-4a85-6860-b5cbea7b529e",
          correlationId: "a82e0cae-7b09-c036-14ef-82daed8fa042",
          externalArgumentsHash: "bbb93ef2-6e3c-101f-f11c-dd21cab08a94",
        },
      });
    });

    test("arguments hash is same for same arguments", async () => {
      const testsGenerator = generator.tests;
      const testsArguments: Argument[] = [
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
        entityType: type,
        arguments: testsArguments,
      });
      const second = await testsGenerator.create({
        entityType: type,
        arguments: testsArguments,
      });

      expect(first.argumentsHash).toEqual(second.argumentsHash);
    });

    test("arguments hash is different for different arguments", async () => {
      const testsGenerator = generator.tests;
      const testsArguments1: Argument[] = [
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

      const testsArguments2: Argument[] = [
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
        entityType: type,
        arguments: testsArguments1,
      });
      const second = await testsGenerator.create({
        entityType: type,
        arguments: testsArguments2,
      });

      expect(first.argumentsHash).not.toEqual(second.argumentsHash);
    });
  }),
);

type CreateTestRequestBodyRequiredFields =
  RemoveNullishProps<CreateTestRequestBody>;
type CreateTestRequestBodyAllFieldsRequired = Required<CreateTestRequestBody>;
type Argument = NonNullable<CreateTestRequestBody["arguments"]>[0];
type CreateTestRequestBody = CreateTestRequest["body"];
type CreateTestRequest = ClientInferRequest<typeof contract.createTest>;
