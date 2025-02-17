import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";

const generator = new CoreEntititesGenerator(client);

describe("find launches count", () => {
  test("without distinct", async () => {
    const report = await generator.reports.create();
    await generator.launches.createMany(2, {
      reportId: report.id,
      correlationId: "6ed24bda-c33d-4856-9a2d-1a44e6f81eb7",
      argumentsHash: "88bc4744-bc74-46cb-a197-354f09c81b1f",
    });
    await generator.launches.create({
      reportId: report.id,
      correlationId: "9e16f29a-d77a-4c5b-a0d4-3012c76349f1",
      argumentsHash: "284a5613-7903-4dd9-99bc-686384709e23",
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

  test("with distinct", async () => {
    const report = await generator.reports.create();
    await generator.launches.createMany(2, {
      reportId: report.id,
      correlationId: "6ed24bda-c33d-4856-9a2d-1a44e6f81eb7",
      argumentsHash: "88bc4744-bc74-46cb-a197-354f09c81b1f",
    });
    await generator.launches.create({
      reportId: report.id,
      correlationId: "9e16f29a-d77a-4c5b-a0d4-3012c76349f1",
      argumentsHash: "284a5613-7903-4dd9-99bc-686384709e23",
    });
    await generator.launches.create({
      reportId: report.id,
      correlationId: "9e16f29a-d77a-4c5b-a0d4-3012c76349f1",
      argumentsHash: "914e5248-f8ad-4ec9-9a62-8e68c1166a32",
    });
    await generator.launches.create({
      reportId: report.id,
      correlationId: "91bf953b-3727-4bea-a208-4231dcf889e3",
      argumentsHash: "914e5248-f8ad-4ec9-9a62-8e68c1166a32",
    });

    const findLaunchesResponse = await client.findLaunchesCount({
      query: {
        reportId: report.id,
        distinct: true
      },
    });

    expect(findLaunchesResponse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        count: 4,
      },
    });
  });
});
