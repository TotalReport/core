import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import { ClientInferResponseBody } from "@ts-rest/core";
import { expect } from "earl";
import { contract } from "@total-report/core-contract/contract";
import "../../tools/earl-extensions.js";
import { DEFAULT_TEST_STATUSES } from "@total-report/core-schema/constants";
import { expect_toBe } from "../../tools/utils.js";
import { add } from "date-fns/add";
import { sub } from "date-fns/sub";

const generator = new CoreEntititesGenerator(client);

describe("find test entities counts by statuses", () => {
  test("distincts by test correlation ID", async () => {
    // Create a report and launch
    const report = await generator.reports.create();
    const launch = await generator.launches.create({
      reportId: report.id,
    });

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
      query: { reportId: report.id, distinct: true },
    });
    expect(responseWithDistinct).toEqual({
      headers: expect.anything(),
      status: 200,
      body: [
        {
          entityType: "test",
          statusId: passedStatusId,
          count: 2,
        },
      ],
    });

    // With distinct=false, expect all 5 test entities to be counted
    const responseWithoutDistinct =
      await client.findTestEntitiesCountsByStatuses({
        query: { reportId: report.id, distinct: false },
      });

    expect(responseWithoutDistinct).toEqual({
      headers: expect.anything(),
      status: 200,
      body: [
        {
          entityType: "test",
          statusId: passedStatusId,
          count: 5,
        },
      ],
    });
  });

  test("handles null status IDs", async () => {
    // Create a report and launch
    const report = await generator.reports.create();
    const launch = await generator.launches.create({ reportId: report.id });

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
      query: { reportId: report.id, distinct: true },
    });

    expect_toBe(response.status, 200);

    response.body = sortCounts(response.body);

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: [
        {
          entityType: "test",
          statusId: null,
          count: 1,
        },
        {
          entityType: "test",
          statusId: DEFAULT_TEST_STATUSES.PASSED.id,
          count: 1,
        },
      ],
    });

    // With distinct=false, expect all 5 test entities to be counted
    const responseDistinctFalse = await client.findTestEntitiesCountsByStatuses(
      {
        query: { reportId: report.id, distinct: false },
      }
    );

    expect_toBe(responseDistinctFalse.status, 200);

    responseDistinctFalse.body = sortCounts(responseDistinctFalse.body);

    expect(responseDistinctFalse).toEqual({
      headers: expect.anything(),
      status: 200,
      body: [
        {
          entityType: "test",
          statusId: null,
          count: 2,
        },
        {
          entityType: "test",
          statusId: DEFAULT_TEST_STATUSES.PASSED.id,
          count: 3,
        },
      ],
    });
  });

  test("takes status of the latest created test", async () => {
    // Create a report and launch
    const report = await generator.reports.create();
    const launch = await generator.launches.create({ reportId: report.id });

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
      query: { reportId: report.id, distinct: true },
    });

    expect(responseWithDistinct).toEqual({
      headers: expect.anything(),
      status: 200,
      body: [
        {
          entityType: "test",
          statusId: null,
          count: 1,
        },
      ],
    });

    // With distinct=false, expect all 2 test entities to be counted
    const responseWithoutDistinct =
      await client.findTestEntitiesCountsByStatuses({
        query: { reportId: report.id, distinct: false },
      });

    expect_toBe(responseWithoutDistinct.status, 200);

    responseWithoutDistinct.body = sortCounts(responseWithoutDistinct.body);

    expect(responseWithoutDistinct).toEqual({
      headers: expect.anything(),
      status: 200,
      body: [
        {
          entityType: "test",
          statusId: null,
          count: 1,
        },
        {
          entityType: "test",
          statusId: passedStatusId,
          count: 1,
        },
      ],
    });
  });

  test("takes status of the latest finished test if other dates are equal", async () => {
    // Create a report and launch
    const report = await generator.reports.create();
    const launch = await generator.launches.create({ reportId: report.id });

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
      query: { reportId: report.id, distinct: true },
    });

    expect(responseWithDistinct).toEqual({
      headers: expect.anything(),
      status: 200,
      body: [
        {
          entityType: "test",
          statusId: failedStatusId,
          count: 1,
        },
      ],
    });

    // With distinct=false, expect all 2 test entities to be counted
    const responseWithoutDistinct =
      await client.findTestEntitiesCountsByStatuses({
        query: { reportId: report.id, distinct: false },
      });

    expect_toBe(responseWithoutDistinct.status, 200);

    responseWithoutDistinct.body = sortCounts(responseWithoutDistinct.body);

    expect(responseWithoutDistinct).toEqual({
      headers: expect.anything(),
      status: 200,
      body: [
        {
          entityType: "test",
          statusId: failedStatusId,
          count: 1,
        },
        {
          entityType: "test",
          statusId: passedStatusId,
          count: 1,
        },
      ],
    });
  });

  test("handles reportId absence", async () => {
    // Create multiple reports with launches and tests
    const launchcorrelationId = "59e75c4b-9ade-44e7-85fe-2294003ddf04";
    const launchArgumentsHash = "a584f719-cd2b-421f-99e3-db4904358f0f";

    const report1 = await generator.reports.create();
    const launch1 = await generator.launches.create({
      reportId: report1.id,
    });

    const report2 = await generator.reports.create();
    const launch2 = await generator.launches.create({
      reportId: report2.id,
    });

    // Create tests in both reports
    const testCorrelationId = "5801ea0d-f00d-4cc8-b4d3-6a705ae5d9cf";
    const testArgumentsHash = "96ba411b-ee11-49db-b691-7bf9ada097e4";
    const passedStatusId = DEFAULT_TEST_STATUSES.PASSED.id;
    
    await generator.tests.create({
      launchId: launch1.id,
      statusId: passedStatusId,
      correlationId: testCorrelationId,
      argumentsHash: testArgumentsHash,
    });

    await generator.tests.create({
      launchId: launch2.id,
      statusId: passedStatusId,
      correlationId: testCorrelationId,
      argumentsHash: testArgumentsHash,
    });
  });

  test("filters by launchId", async () => {
    // Create a report with multiple launches
    const report = await generator.reports.create();
    
    // Create two launches in the same report
    const launch1 = await generator.launches.create({
      reportId: report.id,
    });
    
    const launch2 = await generator.launches.create({
      reportId: report.id,
    });
    
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
          statusId: passedStatusId,
          count: 2,
        },
      ],
    });
    
    // Without filter - should return all 5 tests
    const responseAll = await client.findTestEntitiesCountsByStatuses({
      query: { reportId: report.id, distinct: false },
    });
    
    expect_toBe(responseAll.status, 200);
    
    expect(responseAll).toEqual({
      headers: expect.anything(),
      status: 200,
      body: [
        {
          entityType: "test",
          statusId: passedStatusId,
          count: 5, // 2 + 3
        },
      ],
    });
  });

  test("handles multiple entity types within the same launch", async () => {
    const report = await generator.reports.create();
    const launch = await generator.launches.create({ reportId: report.id });

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
      query: { reportId: report.id, distinct: true },
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
          statusId: passedStatusId,
          count: 1,
        },
        {
          entityType: "beforeTest",
          statusId: passedStatusId,
          count: 1,
        },
        {
          entityType: "test",
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
