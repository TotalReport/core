import { expect } from "earl";
import "../tools/earl-extensions.js";
import { describe, test } from "mocha";
import { client } from "../tools/client.js";
import { generateLaunch } from "../tools/launch-generator.js";
import { TestsGenerator } from "../tools/test-generator.js";

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
        id: expect.a(String),
        title: "New test",
        createdTimestamp: expect.isCloseToNow(3000),
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

  test("arguments hashes are different for different arguments", async () => {
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
});
