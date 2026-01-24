import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";

const generator = new CoreEntititesGenerator(client);

describe("find launches", () => {
  beforeEach(async () => {
    await generator.launches.deleteAll();
  });


  test("by title contains", async () => {
    const request1 = {
      title: "Launch Alpha",
    };
    const request2 = {
      title: "Launch Beta",
    };
    const request3 = {
      title: "Launch Gamma",
    };
    const request4 = {
      title: "Test Delta",
    };
    const launch1 = await generator.launches.create(request1);
    const launch2 = await generator.launches.create(request2);
    const launch3 = await generator.launches.create(request3);
    const launch4 = await generator.launches.create(request4);

    const limit = 10;
    const offset = 0;

    const response = await client.findLaunches({
      query: {
        "title~cnt": "Launch",
        limit,
        offset,
      },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        pagination: {
          total: 3,
          limit,
          offset,
        },
        items: [launch1, launch2, launch3],
      },
    });

    const response2 = await client.findLaunches({
      query: {
        "title~cnt": "Beta",
        limit,
        offset,
      },
    });

    expect(response2).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        pagination: {
          total: 1,
          limit,
          offset,
        },
        items: [launch2],
      },
    });
  });
});
