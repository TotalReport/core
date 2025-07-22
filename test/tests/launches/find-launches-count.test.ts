import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";

const generator = new CoreEntititesGenerator(client);

describe("find launches count", () => {
  test("count of all", async () => {
    const report = await generator.reports.create();
    await generator.launches.createMany(2, {
      reportId: report.id,
    });
    await generator.launches.create({
      reportId: report.id,
    });

    const findLaunchesResponse = await client.findLaunchesCount({
      query: {
        reportId: report.id,
      },
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
