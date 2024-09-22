import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../tools/client.js";
import { generateLaunch } from "../tools/launch-generator.js";

describe("before tests", () => {
  test("create before test", async () => {
    const launch = await generateLaunch();
    const response =  await client.createBeforeTest({
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
        id: expect.a(String),
        title: "New before test",
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
      }
    })
  });
});
