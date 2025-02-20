import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import { ClientInferResponseBody } from "@ts-rest/core";
import { expect } from "earl";
import { contract } from "@total-report/core-contract/contract";
import "../../tools/earl-extensions.js";

const generator = new CoreEntititesGenerator(client);

describe("test entities", () => {
  test("include all types of entities", async () => {
    const launch1 = await generator.launches.create();
    const launch2 = await generator.launches.create();

    const rootContext11 = await generator.contexts.create({
      launchId: launch1.id,
    });
    const rootContext21 = await generator.contexts.create({
      launchId: launch2.id,
    });

    const context12InRootContext11 = await generator.contexts.create({
      parentTestContextId: rootContext11.id,
      launchId: launch1.id,
    });
    const context22InRootContext21 = await generator.contexts.create({
      parentTestContextId: rootContext21.id,
      launchId: launch2.id,
    });

    const rootBeforeTest11 = await generator.beforeTests.create({
      launchId: launch1.id,
    });
    const rootBeforeTest21 = await generator.beforeTests.create({
      launchId: launch2.id,
    });

    const beforeTest12InRootContext11 = await generator.beforeTests.create({
      testContextId: rootContext11.id,
      launchId: launch1.id,
    });
    const beforeTest22InRootContext21 = await generator.beforeTests.create({
      testContextId: rootContext21.id,
      launchId: launch2.id,
    });

    const beforeTest13InContext12 = await generator.beforeTests.create({
      testContextId: context12InRootContext11.id,
      launchId: launch1.id,
    });
    const beforeTest23InContext22 = await generator.beforeTests.create({
      testContextId: context22InRootContext21.id,
      launchId: launch2.id,
    });

    const rootTest11 = await generator.tests.create({
      launchId: launch1.id,
    });
    const rootTest21 = await generator.tests.create({
      launchId: launch2.id,
    });

    const test12InRootContext11 = await generator.tests.create({
      testContextId: rootContext11.id,
      launchId: launch1.id,
    });
    const test22InRootContext21 = await generator.tests.create({
      testContextId: rootContext21.id,
      launchId: launch2.id,
    });

    const test13InContext12 = await generator.tests.create({
      testContextId: context12InRootContext11.id,
      launchId: launch1.id,
    });
    const test23InContext22 = await generator.tests.create({
      testContextId: context22InRootContext21.id,
      launchId: launch2.id,
    });

    const rootAfterTest11 = await generator.afterTests.create({
      launchId: launch1.id,
    });
    const rootAfterTest21 = await generator.afterTests.create({
      launchId: launch2.id,
    });

    const afterTest12InRootContext11 = await generator.afterTests.create({
      testContextId: rootContext11.id,
      launchId: launch1.id,
    });
    const afterTest22InRootContext21 = await generator.afterTests.create({
      testContextId: rootContext21.id,
      launchId: launch2.id,
    });

    const afterTest13InContext12 = await generator.afterTests.create({
      testContextId: context12InRootContext11.id,
      launchId: launch1.id,
    });
    const afterTest23InContext22 = await generator.afterTests.create({
      testContextId: context22InRootContext21.id,
      launchId: launch2.id,
    });

    const entitiesByLaunch = await client.findTestEntities({
      query: {
        launchId: launch1.id,
        limit: 20,
        offset: 0,
      },
    });

    expect(entitiesByLaunch).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        items: [
          beforeTestToEntity(rootBeforeTest11),
          beforeTestToEntity(beforeTest12InRootContext11),
          beforeTestToEntity(beforeTest13InContext12),
          testToEntity(rootTest11),
          testToEntity(test12InRootContext11),
          testToEntity(test13InContext12),
          afterTestToEntity(rootAfterTest11),
          afterTestToEntity(afterTest12InRootContext11),
          afterTestToEntity(afterTest13InContext12),
        ],
        pagination: {
          limit: 20,
          offset: 0,
          total: 9,
        },
      },
    });

    const entitiesByRootContext = await client.findTestEntities({
      query: {
        contextId: rootContext11.id,
        limit: 20,
        offset: 0,
      },
    });

    expect(entitiesByRootContext).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        items: [
          beforeTestToEntity(beforeTest12InRootContext11),
          testToEntity(test12InRootContext11),
          afterTestToEntity(afterTest12InRootContext11),
        ],
        pagination: {
          limit: 20,
          offset: 0,
          total: 3,
        },
      },
    });

    const entitiesByNestedContext = await client.findTestEntities({
        query: {
          contextId: context12InRootContext11.id,
          limit: 20,
          offset: 0,
        },
      });
  
      expect(entitiesByNestedContext).toEqual({
        headers: expect.anything(),
        status: 200,
        body: {
          items: [
            beforeTestToEntity(beforeTest13InContext12),
            testToEntity(test13InContext12),
            afterTestToEntity(afterTest13InContext12),
          ],
          pagination: {
            limit: 20,
            offset: 0,
            total: 3,
          },
        },
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

    const response = await client.findTestEntities({
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
        items: [testToEntity(created)],
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

    const response = await client.findTestEntities({
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
        items: [testToEntity(created)],
      },
    });
  });

  test("by contextId", async () => {
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
    await generator.tests.create({ testContextId: testContext2.id });

    const limit = 10;
    const offset = 0;

    const response = await client.findTestEntities({
      query: { contextId: testContext.id, limit, offset },
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
        items: [testToEntity(expectedRecord)],
      },
    });
  });

  test("by correlationId", async () => {
    const launch = await generator.launches.create();
    const correlationId = "cf11c6c2-ed80-46d6-ac55-d1181b59a69f";
    const created = await generator.tests.create({
      launchId: launch.id,
      correlationId,
    });

    // Record that should be filtered out
    await generator.tests.create({
      launchId: launch.id,
      correlationId: "0f4ae45f-69c4-4afc-9367-610dd423aa6c",
    });

    const limit = 10;
    const offset = 0;

    const response = await client.findTestEntities({
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
        items: [testToEntity(created)],
      },
    });
  });

  test("by argumentsHash", async () => {
    const launch = await generator.launches.create();
    const argumentsHash = "cf555a84-75b5-4d08-b5ce-639ec35015fd";
    const created = await generator.tests.create({
      launchId: launch.id,
      argumentsHash,
    });

    // Record that should be filtered out
    await generator.tests.create({
      launchId: launch.id,
      argumentsHash: "7daae764-6eca-44d8-9324-020a8fb4507a",
    });

    const limit = 10;
    const offset = 0;

    const response = await client.findTestEntities({
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
        items: [testToEntity(created)],
      },
    });
  });

  test("distinct entities", async () => {
    const launch = await generator.launches.create();
    const correlationId = "123e4567-e89b-12d3-a456-426614174000";
    const argumentsHash = "6a6cd8dd-3dd7-4804-b98b-ce70cfb93496";
    const created1 = await generator.tests.create({
      launchId: launch.id,
      correlationId,
      argumentsHash,
    });
    const created2 = await generator.tests.create({
      launchId: launch.id,
      correlationId,
      argumentsHash,
    });

    const limit = 10;
    const offset = 0;

    const response = await client.findTestEntities({
      query: { correlationId, argumentsHash, distinct: true, limit, offset },
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
        items: [testToEntity(created2)],
      },
    });
  });

  test("by entityType", async () => {
    const launch = await generator.launches.create();
    const beforeTest = await generator.beforeTests.create({ launchId: launch.id });
    const test = await generator.tests.create({ launchId: launch.id });
    const afterTest = await generator.afterTests.create({ launchId: launch.id });

    const limit = 10;
    const offset = 0;

    const response = await client.findTestEntities({
      query: { entityTypes: ["before test"], launchId: launch.id, limit, offset },
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
        items: [beforeTestToEntity(beforeTest)],
      },
    });

    const response2 = await client.findTestEntities({
      query: { entityTypes: ["test"], launchId: launch.id, limit, offset },
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
        items: [testToEntity(test)],
      },
    });

    const response3 = await client.findTestEntities({
      query: { entityTypes: ["after test"], launchId: launch.id, limit, offset },
    });

    expect(response3).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        pagination: {
          total: 1,
          limit,
          offset,
        },
        items: [afterTestToEntity(afterTest)],
      },
    });
  });

  test("by title contains", async () => {
    const launch = await generator.launches.create();
    const test1 = await generator.tests.create({ launchId: launch.id, title: "Test Entity 1" });
    const test2 = await generator.tests.create({ launchId: launch.id, title: "Another Test Entity" });

    const limit = 10;
    const offset = 0;

    const response = await client.findTestEntities({
      query: { "title~cnt": "Test", launchId: launch.id, limit, offset },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        pagination: {
          total: 2,
          limit,
          offset,
        },
        items: [testToEntity(test1), testToEntity(test2)],
      },
    });

    const response2 = await client.findTestEntities({
      query: { "title~cnt": "Another", launchId: launch.id, limit, offset },
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
        items: [testToEntity(test2)],
      },
    });
  });
});

const beforeTestToEntity = (entity: BeforeTest): TestEntity => {
  return {
    launchId: entity.launchId,
    ...(entity.testContextId
      ? { parentContextId: entity.testContextId }
      : undefined),
    entityType: "before test",
    id: entity.id,
    title: entity.title,
    createdTimestamp: entity.createdTimestamp,
    ...(entity.startedTimestamp
      ? { startedTimestamp: entity.startedTimestamp }
      : undefined),
    ...(entity.finishedTimestamp
      ? { finishedTimestamp: entity.finishedTimestamp }
      : undefined),
    ...(entity.statusId ? { statusId: entity.statusId } : undefined),
    ...(entity.correlationId ? { correlationId: entity.correlationId } : undefined),
    ...(entity.argumentsHash ? { argumentsHash: entity.argumentsHash } : undefined),
  };
};

const testToEntity = (entity: Test): TestEntity => {
  return {
    launchId: entity.launchId,
    ...(entity.testContextId
      ? { parentContextId: entity.testContextId }
      : undefined),
    entityType: "test",
    id: entity.id,
    title: entity.title,
    createdTimestamp: entity.createdTimestamp,
    ...(entity.startedTimestamp
      ? { startedTimestamp: entity.startedTimestamp }
      : undefined),
    ...(entity.finishedTimestamp
      ? { finishedTimestamp: entity.finishedTimestamp }
      : undefined),
    ...(entity.statusId ? { statusId: entity.statusId } : undefined),
    ...(entity.correlationId ? { correlationId: entity.correlationId } : undefined),
    ...(entity.argumentsHash ? { argumentsHash: entity.argumentsHash } : undefined),
  };
};

const afterTestToEntity = (entity: AfterTest): TestEntity => {
  return {
    launchId: entity.launchId,
    ...(entity.testContextId
      ? { parentContextId: entity.testContextId }
      : undefined),
    entityType: "after test",
    id: entity.id,
    title: entity.title,
    createdTimestamp: entity.createdTimestamp,
    ...(entity.startedTimestamp
      ? { startedTimestamp: entity.startedTimestamp }
      : undefined),
    ...(entity.finishedTimestamp
      ? { finishedTimestamp: entity.finishedTimestamp }
      : undefined),
    ...(entity.statusId ? { statusId: entity.statusId } : undefined),
    ...(entity.correlationId ? { correlationId: entity.correlationId } : undefined),
    ...(entity.argumentsHash ? { argumentsHash: entity.argumentsHash } : undefined),
  };
};

type TestEntity = ClientInferResponseBody<
  typeof contract.findTestEntities,
  200
>["items"][0];
type TestContext = ClientInferResponseBody<
  typeof contract.createTestContext,
  201
>;
type BeforeTest = ClientInferResponseBody<
  typeof contract.createBeforeTest,
  201
>;
type Test = ClientInferResponseBody<typeof contract.createTest, 201>;
type AfterTest = ClientInferResponseBody<typeof contract.createAfterTest, 201>;
