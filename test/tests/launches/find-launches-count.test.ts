import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { expect } from "earl";
import { describe, test } from "mocha";
import { loginVerifiedTestUser } from "../../tools/auth.js";
import type { VerifiedTestUserSession } from "../../tools/auth.js";
import "../../tools/earl-extensions.js";

describe("find launches count", () => {
  let client: VerifiedTestUserSession["client"];
  let generator: CoreEntititesGenerator;

  before(async () => {
    ({ client, generator } = await loginVerifiedTestUser());
  });

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
