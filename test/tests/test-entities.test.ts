import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { describe, test } from "mocha";
import { client } from "../tools/client.js";
import { ClientInferResponseBody } from "@ts-rest/core";
import { expect } from "earl";
import { contract } from "@total-report/core-contract/contract";
import "../tools/earl-extensions.js";

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
          contextToEntity(rootContext11),
          contextToEntity(context12InRootContext11),
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
          total: 11,
        },
      },
    });

    const entitiesByRootContext = await client.findTestEntities({
      query: {
        parentContextId: rootContext11.id,
        limit: 20,
        offset: 0,
      },
    });

    expect(entitiesByRootContext).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        items: [
          contextToEntity(context12InRootContext11),
          beforeTestToEntity(beforeTest12InRootContext11),
          testToEntity(test12InRootContext11),
          afterTestToEntity(afterTest12InRootContext11),
        ],
        pagination: {
          limit: 20,
          offset: 0,
          total: 4,
        },
      },
    });

    const entitiesByNestedContext = await client.findTestEntities({
        query: {
          parentContextId: context12InRootContext11.id,
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
});

const contextToEntity = (entity: TestContext): TestEntity => {
  return {
    launchId: entity.launchId,
    ...(entity.parentTestContextId
      ? { parentContextId: entity.parentTestContextId }
      : undefined),
    entityType: "test context",
    id: entity.id,
    title: entity.title,
    createdTimestamp: entity.createdTimestamp,
    ...(entity.startedTimestamp
      ? { startedTimestamp: entity.startedTimestamp }
      : undefined),
    ...(entity.finishedTimestamp
      ? { finishedTimestamp: entity.finishedTimestamp }
      : undefined),
  };
};

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
