import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../tools/client.js";
import { generateLaunch } from "../tools/launch-generator.js";
import { AfterTestsGenerator } from "../tools/after-test-generator.js";

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
        id: expect.a(String),
        title: "New after test",
        createdTimestamp: expect.a(String),
        launchId: launch.id,
        argumentsHash: expect.a(String),
        arguments: [
          {
            id: expect.a(String),
            name: "Argument1",
            type: "String",
            value: "value1",
          },
          {
            id: expect.a(String),
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
});
