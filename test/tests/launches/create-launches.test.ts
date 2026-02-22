import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";
import { start } from "repl";


describe("create launches", () => {
  test("with minimum fields", async () => {
    const request = { title: "New launch", startedTimestamp: new Date("2024-07-21T06:52:35Z") };

    const response = await client.createLaunch({ body: request });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 201,
      body: {
        id: expect.a(Number),
        title: request.title,
        startedTimestamp: request.startedTimestamp.toISOString(),
      },
    });
  });

  test("with maximum fields", async () => {
    const request = {
      title: "Launch 2",
      arguments: "--tests LaunchesTests",
      createdTimestamp: new Date("2024-07-21T06:52:32Z"),
      startedTimestamp: new Date("2024-07-21T06:52:35Z"),
      finishedTimestamp: new Date("2024-07-21T06:53:21Z"),
    };

    const response = await client.createLaunch({ body: request });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 201,
      body: {
        id: expect.a(Number),
        title: request.title,
        arguments: request.arguments,
        startedTimestamp: request.startedTimestamp.toISOString(),
        finishedTimestamp: request.finishedTimestamp.toISOString(),
      },
    });
  });
});
