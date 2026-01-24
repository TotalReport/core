import { contract } from "@total-report/core-contract/contract";
import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import {
  DEFAULT_TEST_STATUSES
} from "@total-report/core-schema/constants";
import { ClientInferResponseBody } from "@ts-rest/core";
import { add } from "date-fns/add";
import { sub } from "date-fns/sub";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";
import { expect_toBe } from "../../tools/utils.js";

const generator = new CoreEntititesGenerator(client);

describe("find test entities counts by statuses", () => {
  beforeEach(async () => {
    await generator.launches.deleteAll();
  });

  test("distincts by test correlation ID", async () => {
    // Create a launch
    const launch = await generator.launches.create({});

    // create tests with different correlation IDs
    const passedStatusId = DEFAULT_TEST_STATUSES.PASSED.id;
    const testArgumentsHash = "89fbeb32-2f4b-43a8-b942-7712fc695c4e";

    await generator.tests.createMultiple(2, () => {
      return {
        launchId: launch.id,
        statusId: passedStatusId,
        correlationId: "25d50f30-9fe2-4d6e-a770-bf40835f0f71",
        argumentsHash: testArgumentsHash,
      };
    });

    await generator.tests.createMultiple(3, () => {
      return {
        launchId: launch.id,
        statusId: passedStatusId,
        correlationId: "1d57a097-4019-480e-a8b0-0f0cbb1a6f85",
        argumentsHash: testArgumentsHash,
      };
    });

    // With distinct=true, expect 2 distinct test entities
    const responseWithDistinct = await client.findTestEntitiesCountsByStatuses({
      query: { distinct: true },
    });
    expect(responseWithDistinct).toEqual({
      headers: expect.anything(),
      status: 200,
      body: [
        {
          entityType: "test",
          statusGroupId: DEFAULT_TEST_STATUSES.PASSED.groupId,
          statusId: passedStatusId,
          count: 2,
        },
      ],
    });

    // With distinct=false, expect all 5 test entities to be counted
    const responseWithoutDistinct =
      await client.findTestEntitiesCountsByStatuses({
        query: { distinct: false },
      });

    expect(responseWithoutDistinct).toEqual({
      headers: expect.anything(),
      status: 200,
      body: [
        {
          entityType: "test",
          statusGroupId: DEFAULT_TEST_STATUSES.PASSED.groupId,
          statusId: passedStatusId,
          count: 5,
        },
      ],
    });
  });

  test("handles null status IDs", async () => {
    // Create a launch
    const launch = await generator.launches.create({});

    const testCorrelationId = "ebd297c7-878d-4104-b232-d69129005e81";
    const testArgumentsHash = "f21e0195-1a62-45b7-a8c3-dc1475cec94e";

    // Create tests with null status ID
    await generator.tests.createMultiple(2, () => {
      return {
        launchId: launch.id,
        statusId: undefined,
        correlationId: testCorrelationId,
        argumentsHash: testArgumentsHash,
      };
    });

    // Create a test with non-null status ID
    await generator.tests.createMultiple(3, () => {
      return {
        launchId: launch.id,
        statusId: DEFAULT_TEST_STATUSES.PASSED.id,
        correlationId: "a5ac058d-60cf-4a50-a809-a20360617a3f",
        argumentsHash: "5bfdd3a6-9bd4-4603-8764-08fae78e4a6e",
      };
    });

    // With distinct=true, expect 2 distinct test entities
    const response = await client.findTestEntitiesCountsByStatuses({
      query: { distinct: true },
    });

    expect_toBe(response.status, 200);

    response.body = sortCounts(response.body);

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: [
        {
          entityType: "test",
          statusGroupId: null,
          statusId: null,
          count: 1,
        },
        {
          entityType: "test",
          statusGroupId: DEFAULT_TEST_STATUSES.PASSED.groupId,
          statusId: DEFAULT_TEST_STATUSES.PASSED.id,
          count: 1,
        },
      ],
    });

    // With distinct=false, expect all 5 test entities to be counted
    const responseDistinctFalse = await client.findTestEntitiesCountsByStatuses(
      {
        query: { distinct: false },
      },
    );

    expect_toBe(responseDistinctFalse.status, 200);

    responseDistinctFalse.body = sortCounts(responseDistinctFalse.body);

    expect(responseDistinctFalse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: [
        {
          entityType: "test",
          statusGroupId: null,
          statusId: null,
          count: 2,
        },
        {
          entityType: "test",
          statusGroupId: DEFAULT_TEST_STATUSES.PASSED.groupId,
          statusId: DEFAULT_TEST_STATUSES.PASSED.id,
          count: 3,
        },
      ],
    });
  });

  test("takes status of the latest created test", async () => {
    // Create a launch
    const launch = await generator.launches.create({});

    // Create tests with different statuses and started timestamps
    const testCorrelationId = "9b064b46-49ee-46c1-b814-70276a16d7cc";
    const testArgumentsHash = "af8d4b15-56b1-455f-8f3c-c8bd15f9c7fe";
    const passedStatusId = DEFAULT_TEST_STATUSES.PASSED.id;
    const timestampBefore = new Date("2023-01-01T00:00:01Z");
    const timestampAfter = add(timestampBefore, { seconds: 3 });

    await generator.tests.create({
      launchId: launch.id,
      correlationId: testCorrelationId,
      argumentsHash: testArgumentsHash,
      createdTimestamp: timestampBefore,
      startedTimestamp: timestampBefore,
      finishedTimestamp: add(timestampBefore, { seconds: 1 }),
      statusId: passedStatusId,
    });

    await generator.tests.create({
      launchId: launch.id,
      correlationId: testCorrelationId,
      argumentsHash: testArgumentsHash,
      createdTimestamp: timestampAfter,
      statusId: undefined,
    });

    // With distinct=true, expect 1 distinct test entity
    const responseWithDistinct = await client.findTestEntitiesCountsByStatuses({
      query: { distinct: true },
    });

    expect(responseWithDistinct).toEqual({
      headers: expect.anything(),
      status: 200,
      body: [
        {
          entityType: "test",
          statusGroupId: null,
          statusId: null,
          count: 1,
        },
      ],
    });

    // With distinct=false, expect all 2 test entities to be counted
    const responseWithoutDistinct =
      await client.findTestEntitiesCountsByStatuses({
        query: { distinct: false },
      });

    expect_toBe(responseWithoutDistinct.status, 200);

    responseWithoutDistinct.body = sortCounts(responseWithoutDistinct.body);

    expect(responseWithoutDistinct).toEqual({
      headers: expect.anything(),
      status: 200,
      body: [
        {
          entityType: "test",
          statusGroupId: null,
          statusId: null,
          count: 1,
        },
        {
          entityType: "test",
          statusGroupId: DEFAULT_TEST_STATUSES.PASSED.groupId,
          statusId: passedStatusId,
          count: 1,
        },
      ],
    });
  });

  test("takes status of the latest finished test if other dates are equal", async () => {
    // Create a launch
    const launch = await generator.launches.create({});

    // Create tests with different statuses and finished timestamps
    const testCorrelationId = "4c1fab0f-b7a3-4fb4-a2e3-dd71fd2c1018";
    const testArgumentsHash = "05af10c3-64a6-4df9-a28f-8df164b767c0";
    const passedStatusId = DEFAULT_TEST_STATUSES.PASSED.id;
    const failedStatusId = DEFAULT_TEST_STATUSES.FAILED.id;
    const timestampBefore = new Date("2023-01-01T00:00:01Z");
    const timestampAfter = add(timestampBefore, { seconds: 3 });

    await generator.tests.create({
      launchId: launch.id,
      correlationId: testCorrelationId,
      argumentsHash: testArgumentsHash,
      createdTimestamp: timestampBefore,
      startedTimestamp: timestampBefore,
      finishedTimestamp: sub(timestampAfter, { seconds: 1 }),
      statusId: passedStatusId,
    });

    await generator.tests.create({
      launchId: launch.id,
      correlationId: testCorrelationId,
      argumentsHash: testArgumentsHash,
      createdTimestamp: timestampBefore,
      startedTimestamp: timestampBefore,
      finishedTimestamp: timestampAfter,
      statusId: failedStatusId,
    });

    // With distinct=true, expect 1 distinct test entity
    const responseWithDistinct = await client.findTestEntitiesCountsByStatuses({
      query: { distinct: true },
    });

    expect(responseWithDistinct).toEqual({
      headers: expect.anything(),
      status: 200,
      body: [
        {
          entityType: "test",
          statusGroupId: DEFAULT_TEST_STATUSES.FAILED.groupId,
          statusId: failedStatusId,
          count: 1,
        },
      ],
    });

    // With distinct=false, expect all 2 test entities to be counted
    const responseWithoutDistinct =
      await client.findTestEntitiesCountsByStatuses({
        query: { distinct: false },
      });

    expect_toBe(responseWithoutDistinct.status, 200);

    responseWithoutDistinct.body = sortCounts(responseWithoutDistinct.body);

    expect(responseWithoutDistinct).toEqual({
      headers: expect.anything(),
      status: 200,
      body: [
        {
          entityType: "test",
          statusGroupId: DEFAULT_TEST_STATUSES.FAILED.groupId,
          statusId: failedStatusId,
          count: 1,
        },
        {
          entityType: "test",
          statusGroupId: DEFAULT_TEST_STATUSES.PASSED.groupId,
          statusId: passedStatusId,
          count: 1,
        },
      ],
    });
  });

  test("filters by launchId", async () => {
    // Create two launches
    const launch1 = await generator.launches.create({});

    const launch2 = await generator.launches.create({});

    // Create tests with same status across launches
    const passedStatusId = DEFAULT_TEST_STATUSES.PASSED.id;

    // Two tests for launch1
    await generator.tests.createMultiple(2, () => {
      return {
        launchId: launch1.id,
        statusId: passedStatusId,
        correlationId: "d7fe4a92-1c56-4b38-8a7e-9fd3c5e2a64b",
        argumentsHash: "e91a38b5-4728-4f67-bcd2-3c7250d8e7f6",
      };
    });

    // Three tests for launch2
    await generator.tests.createMultiple(3, () => {
      return {
        launchId: launch2.id,
        statusId: passedStatusId,
        correlationId: "84a6c95d-3e71-4b0f-9c2a-1d85fe7b3c6e",
        argumentsHash: "2a9e31f8-7db6-4c05-b817-5e394fd87a2c",
      };
    });

    // Filter by launch1 ID
    const responseLaunch1 = await client.findTestEntitiesCountsByStatuses({
      query: { launchId: launch1.id, distinct: false },
    });

    expect_toBe(responseLaunch1.status, 200);

    expect(responseLaunch1).toEqual({
      headers: expect.anything(),
      status: 200,
      body: [
        {
          entityType: "test",
          statusGroupId: DEFAULT_TEST_STATUSES.PASSED.groupId,
          statusId: passedStatusId,
          count: 2,
        },
      ],
    });

    // Without filter - should return all 5 tests
    const responseAll = await client.findTestEntitiesCountsByStatuses({
      query: { distinct: false },
    });

    expect_toBe(responseAll.status, 200);

    expect(responseAll).toEqual({
      headers: expect.anything(),
      status: 200,
      body: [
        {
          entityType: "test",
          statusGroupId: DEFAULT_TEST_STATUSES.PASSED.groupId,
          statusId: passedStatusId,
          count: 5, // 2 + 3
        },
      ],
    });
  });

  test("handles multiple entity types within the same launch", async () => {
    const launch = await generator.launches.create({});

    const passedStatusId = DEFAULT_TEST_STATUSES.PASSED.id;

    // Create one entity of each type with the passed status
    await generator.beforeTests.create({
      launchId: launch.id,
      statusId: passedStatusId,
    });

    await generator.tests.create({
      launchId: launch.id,
      statusId: passedStatusId,
    });

    await generator.afterTests.create({
      launchId: launch.id,
      statusId: passedStatusId,
    });

    const response = await client.findTestEntitiesCountsByStatuses({
      query: { distinct: true },
    });

    expect_toBe(response.status, 200);

    // Sort the response for easier comparison
    response.body = sortCounts(response.body);

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: [
        {
          entityType: "afterTest",
          statusGroupId: DEFAULT_TEST_STATUSES.PASSED.groupId,
          statusId: passedStatusId,
          count: 1,
        },
        {
          entityType: "beforeTest",
          statusGroupId: DEFAULT_TEST_STATUSES.PASSED.groupId,
          statusId: passedStatusId,
          count: 1,
        },
        {
          entityType: "test",
          statusGroupId: DEFAULT_TEST_STATUSES.PASSED.groupId,
          statusId: passedStatusId,
          count: 1,
        },
      ],
    });
  });
});

type StatusesCountsResponse = ClientInferResponseBody<
  typeof contract.findTestEntitiesCountsByStatuses,
  200
>;

function sortCounts(arr: StatusesCountsResponse) {
  return arr.sort((a, b) => {
    if (a.entityType < b.entityType) return -1;
    if (a.entityType > b.entityType) return 1;
    if (a.statusId == null && b.statusId != null) return -1;
    if (a.statusId != null && b.statusId == null) return 1;
    if (a.statusId != null && b.statusId != null && a.statusId < b.statusId)
      return -1;
    if (a.statusId != null && b.statusId != null && a.statusId > b.statusId)
      return 1;
    return 0;
  });
}
