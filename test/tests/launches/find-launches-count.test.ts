import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";

const generator = new CoreEntititesGenerator(client);

describe("find launches count", () => {
  beforeEach(async () => {
    await generator.launches.deleteAll();
  });

  test("count of all", async () => {
    await generator.launches.createMany(2, {});
    await generator.launches.create({});

    const findLaunchesResponse = await client.findLaunchesCount({
      query: {},
    });

    expect(findLaunchesResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        count: 3,
      },
    });
  });
});
