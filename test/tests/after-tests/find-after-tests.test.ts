import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";

const generator = new CoreEntititesGenerator(client);

describe("find after tests", () => {
  test("by id", async () => {
    const launch = await generator.launches.create();
    const created = await generator.afterTests.create({
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
    });

    const response = await client.readAfterTest({
      params: { id: created.id },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: created,
    });
  });

  test("by launchId", async () => {
    const launch = await generator.launches.create({ });
    const created = await generator.afterTests.create({ launchId: launch.id });

    // Record that should be filtered out
    const launch2 = await generator.launches.create({ });
    await generator.afterTests.create({ launchId: launch2.id });

    const limit = 10;
    const offset = 0;

    const response = await client.findAfterTests({
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
        items: [{ ...created, arguments: [] }],
      },
    });
  });

  test("by correlationId", async () => {
    const launch = await generator.launches.create();
    const correlationId = "123e4567-e89b-12d3-a456-426614174000";
    const created = await generator.afterTests.create({
      launchId: launch.id,
      correlationId,
    });

    // Record that should be filtered out
    await generator.afterTests.create({
      launchId: launch.id,
      correlationId: "3cacd5b2-bb20-48d8-b0f3-d93f2d9c8c61",
    });

    const limit = 10;
    const offset = 0;

    const response = await client.findAfterTests({
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
        items: [{ ...created, arguments: [] }],
      },
    });
  });

  test("by argumentsHash", async () => {
    const launch = await generator.launches.create();
    const argumentsHash = "6a6cd8dd-3dd7-4804-b98b-ce70cfb93496";
    const created = await generator.afterTests.create({
      launchId: launch.id,
      argumentsHash,
    });

    // Record that should be filtered out
    await generator.afterTests.create({
      launchId: launch.id,
      argumentsHash: "eed6bec8-ba3c-4265-b13a-f7e89d3658a0",
    });

    const limit = 10;
    const offset = 0;

    const response = await client.findAfterTests({
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
        items: [{ ...created, arguments: [] }],
      },
    });
  });
});
