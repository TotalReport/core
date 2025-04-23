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
const beforeTest = await entities.beforeTests.create({
  launchId: launch.id,
  testContextId: testContext.id,
  statusId: DEFAULT_TEST_STATUSES.PASSED.id,
});
const test = await entities.tests.create({
  launchId: launch.id,
  testContextId: testContext.id,
  statusId: DEFAULT_TEST_STATUSES.PASSED.id,
});
const afterTest = await entities.afterTests.create({
  launchId: launch.id,
  testContextId: testContext.id,
  statusId: DEFAULT_TEST_STATUSES.PASSED.id,
});
