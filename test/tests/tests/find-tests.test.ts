import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";

const generator = new CoreEntititesGenerator(client);

describe("find tests", () => {
  test("by id", async () => {
    const launch = await generator.launches.create();
    const testContext = await generator.contexts.create({
      launchId: launch.id,
    });
    const created = await generator.tests.create({
      testContextId: testContext.id,
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
    });

    const response = await client.readTest({
      params: { id: created.id },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: created,
    });
  });

  test("by reportId", async () => {
    const report = await generator.reports.create();
    const launch = await generator.launches.create({ reportId: report.id });
    const created = await generator.tests.create({ launchId: launch.id });

    // Record that should be filtered out
    await generator.tests.create();

    const limit = 10;
    const offset = 0;

    const response = await client.findTests({
      query: { reportId: report.id, limit, offset },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        pagination: {
          total: 1,
          limit,
          offset,
        },
        items: [{ ...created, arguments: [] }],
      },
    });
  });

  test("by launchId", async () => {
    const report = await generator.reports.create();
    const launch = await generator.launches.create({ reportId: report.id });
    const created = await generator.tests.create({ launchId: launch.id });

    // Record that should be filtered out
    const launch2 = await generator.launches.create({ reportId: report.id });
    await generator.tests.create({ launchId: launch2.id });

    const limit = 10;
    const offset = 0;

    const response = await client.findTests({
      query: { launchId: launch.id, limit, offset },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        pagination: {
          total: 1,
          limit,
          offset,
        },
        items: [{...created, arguments: []}],
      },
    });
  });

  test("by testContextId", async () => {
    const launch = await generator.launches.create();
    const testContext = await generator.contexts.create({
      launchId: launch.id,
    });
    const expectedRecord = await generator.tests.create({
      testContextId: testContext.id,
      launchId: launch.id,
    });

    // Record that should be filtered out
    const testContext2 = await generator.contexts.create({
      launchId: launch.id,
    });
    await generator.tests.create({ testContextId: testContext2.id,
      launchId: launch.id, });

    const limit = 10;
    const offset = 0;

    const response = await client.findTests({
      query: { testContextId: testContext.id, limit, offset },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        pagination: {
          total: 1,
          limit,
          offset,
        },
        items: [{...expectedRecord, arguments: []}],
      },
    });
  });

  test("by correlationId", async () => {
    const launch = await generator.launches.create();
    const correlationId = "00ee066e-77dc-45ab-953a-d4e945239363";
    const created = await generator.tests.create({
      launchId: launch.id,
      correlationId,
    });

    // Record that should be filtered out
    await generator.tests.create({
      launchId: launch.id,
      correlationId: "d412cab5-913e-4e45-b357-06579075f095",
    });

    const limit = 10;
    const offset = 0;

    const response = await client.findTests({
      query: { correlationId, limit, offset },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        pagination: {
          total: 1,
          limit,
          offset,
        },
        items: [{...created, arguments: []}],
      },
    });
  });

  test("by argumentsHash", async () => {
    const launch = await generator.launches.create();
    const argumentsHash = "f9561dd7-7da9-44ff-9007-a24cc7fd2de5";
    const created = await generator.tests.create({
      launchId: launch.id,
      argumentsHash,
    });

    // Record that should be filtered out
    await generator.tests.create({
      launchId: launch.id,
      argumentsHash: "e0655bf8-d58c-4b15-a053-e2dd418c0392",
    });

    const limit = 10;
    const offset = 0;

    const response = await client.findTests({
      query: { argumentsHash, limit, offset },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        pagination: {
          total: 1,
          limit,
          offset,
        },
        items: [{...created, arguments: []}],
      },
    });
  });
});
