import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";

import { contract } from "@total-report/core-contract/contract";
import { DEFAULT_TEST_STATUSES } from "@total-report/core-schema/constants";
import { initClient } from "@ts-rest/core";

const coreServiceBaseUrl = process.env["CORE_SERVICE_BASE_URL"]!;

export const client = initClient(contract, {
  baseUrl: coreServiceBaseUrl,
  baseHeaders: {},
});

const entities = new CoreEntititesGenerator(client);

const report = await entities.reports.create()

const launch = await entities.launches.create({
  reportId: report.id
});

const testContext = await entities.contexts.create({
  launchId: launch.id
});

await entities.beforeTests.create({
  launchId: launch.id,
  testContextId: testContext.id,
  statusId: DEFAULT_TEST_STATUSES.PASSED.id,
  arguments: [
    {
      name: "arg1",
      type: "string",
      value: "value1"
    },
    {
      name: "arg2",
      type: "number",
      value: "2"
    }
  ]
});

await entities.tests.create({
  launchId: launch.id,
  testContextId: testContext.id,
  statusId: DEFAULT_TEST_STATUSES.PASSED.id,
});

await entities.tests.create({
  launchId: launch.id,
  testContextId: testContext.id,
  statusId: DEFAULT_TEST_STATUSES.PASSED_WITH_WARNING.id,
});

await entities.tests.create({
  launchId: launch.id,
  testContextId: testContext.id,
  statusId: DEFAULT_TEST_STATUSES.FAILED.id,
});

await entities.tests.create({
  launchId: launch.id,
  testContextId: testContext.id,
  statusId: DEFAULT_TEST_STATUSES.AUTOMATION_BUG.id,
});

await entities.tests.create({
  launchId: launch.id,
  testContextId: testContext.id,
  statusId: DEFAULT_TEST_STATUSES.PRODUCT_BUG.id,
});

await entities.tests.create({
  launchId: launch.id,
  testContextId: testContext.id,
  statusId: DEFAULT_TEST_STATUSES.SYSTEM_ISSUE.id,
});

await entities.tests.create({
  launchId: launch.id,
  testContextId: testContext.id,
  statusId: DEFAULT_TEST_STATUSES.NO_DEFECT.id,
});

await entities.tests.create({
  launchId: launch.id,
  testContextId: testContext.id,
  statusId: DEFAULT_TEST_STATUSES.TO_INVESTIGATE.id,
});

await entities.tests.create({
  launchId: launch.id,
  testContextId: testContext.id,
  statusId: DEFAULT_TEST_STATUSES.SKIPPED.id,
});



await entities.tests.create({
  launchId: launch.id,
  testContextId: testContext.id,
  statusId: DEFAULT_TEST_STATUSES.ABORTED.id,
});

await entities.afterTests.create({
  launchId: launch.id,
  testContextId: testContext.id,
  statusId: DEFAULT_TEST_STATUSES.PASSED.id,
});


await entities.tests.create({
  launchId: launch.id,
  testContextId: testContext.id,
});
