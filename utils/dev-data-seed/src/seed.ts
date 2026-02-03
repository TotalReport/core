import { CoreEntititesGenerator } from "@total-report/core-entities-generator/core-entities";

import { contract } from "@total-report/core-contract/contract";
import { CreateTestResponse } from "@total-report/core-entities-generator/test";
import { after } from "@total-report/core-entities-generator/utils";
import { DEFAULT_TEST_STATUSES } from "@total-report/core-schema/constants";
import { initClient } from "@ts-rest/core";
import { add, sub } from "date-fns";

const coreServiceBaseUrl = process.env["CORE_SERVICE_BASE_URL"]!;

export const client = initClient(contract, {
  baseUrl: coreServiceBaseUrl,
  baseHeaders: {},
});

const entities = new CoreEntititesGenerator(client);

const launchesCount = 20;
let passedTest: CreateTestResponse | undefined = undefined;
let failedTest: CreateTestResponse | undefined = undefined;
let flakyToInvestigateTest: CreateTestResponse | undefined = undefined;
let resolvedAutomationBugTest: CreateTestResponse | undefined = undefined;
let productBugTest: CreateTestResponse | undefined = undefined;
let systemIssueTest: CreateTestResponse | undefined = undefined;
let noDefectTest: CreateTestResponse | undefined = undefined;
let skippedTest: CreateTestResponse | undefined = undefined;
let abortedTest: CreateTestResponse | undefined = undefined;

for (let i = 0; i < launchesCount; i++) {
  const launch = await entities.launches.create({
    createdTimestamp: sub(new Date(), { days: launchesCount - i }),
    startedTimestamp: sub(new Date(), { days: launchesCount - i }),
  });

  const testContext = await entities.contexts.create({
    launchId: launch.id,
    createdTimestamp: add(new Date(launch.createdTimestamp!), { seconds: 1 }),
    startedTimestamp: add(new Date(launch.startedTimestamp!), { seconds: 1 }),
  });

  const beforeTest = await entities.beforeTests.create({
    launchId: launch.id,
    testContextId: testContext.id,
    statusId: DEFAULT_TEST_STATUSES.PASSED.id,
    createdTimestamp: add(new Date(testContext.createdTimestamp!), {
      seconds: 1,
    }),
    startedTimestamp: add(new Date(testContext.startedTimestamp!), {
      seconds: 1,
    }),
    finishedTimestamp: add(new Date(testContext.startedTimestamp!), {
      seconds: 2,
    }),
    arguments: [
      {
        name: "arg1",
        type: "string",
        value: "value1",
      },
      {
        name: "arg2",
        type: "number",
        value: "2",
      },
    ],
  });

  passedTest =
    passedTest === undefined
      ? await entities.tests.create({
          launchId: launch.id,
          testContextId: testContext.id,
          startedTimestamp: after({
            timestamp: beforeTest.finishedTimestamp!,
            delayMilliseconds: 1000,
          }),
          finishedTimestamp: after({
            timestamp: beforeTest.finishedTimestamp!,
            delayMilliseconds: 2000,
          }),
          statusId: DEFAULT_TEST_STATUSES.PASSED.id,
        })
      : await entities.tests.createBySample({
          sample: passedTest,
          context: testContext,
          startedTimestamp: after({
            timestamp: beforeTest.finishedTimestamp!,
            delayMilliseconds: 1000,
          }),
          finishedTimestamp: after({
            timestamp: beforeTest.finishedTimestamp!,
            delayMilliseconds: 2000,
          }),
          statusId: DEFAULT_TEST_STATUSES.PASSED.id,
        });

  failedTest =
    failedTest === undefined
      ? await entities.tests.create({
          launchId: launch.id,
          testContextId: testContext.id,
          startedTimestamp: after({
            timestamp: passedTest.finishedTimestamp!,
            delayMilliseconds: 1,
          }),
          finishedTimestamp: after({
            timestamp: passedTest.finishedTimestamp!,
            delayMilliseconds: 2,
          }),
          statusId: DEFAULT_TEST_STATUSES.FAILED.id,
        })
      : await entities.tests.createBySample({
          sample: failedTest,
          context: testContext,
          startedTimestamp: after({
            timestamp: passedTest.finishedTimestamp!,
            delayMilliseconds: 1,
          }),
          finishedTimestamp: after({
            timestamp: passedTest.finishedTimestamp!,
            delayMilliseconds: 2,
          }),
          statusId: DEFAULT_TEST_STATUSES.FAILED.id,
        });

  const flakyStatus =
    i % 2 === 0
      ? DEFAULT_TEST_STATUSES.PASSED.id
      : DEFAULT_TEST_STATUSES.TO_INVESTIGATE.id;
  flakyToInvestigateTest =
    flakyToInvestigateTest === undefined
      ? await entities.tests.create({
          launchId: launch.id,
          testContextId: testContext.id,
          startedTimestamp: after({
            timestamp: passedTest.finishedTimestamp!,
            delayMilliseconds: 1,
          }),
          finishedTimestamp: after({
            timestamp: passedTest.finishedTimestamp!,
            delayMilliseconds: 2,
          }),
          statusId: flakyStatus,
        })
      : await entities.tests.createBySample({
          sample: flakyToInvestigateTest,
          context: testContext,
          startedTimestamp: after({
            timestamp: passedTest.finishedTimestamp!,
            delayMilliseconds: 1,
          }),
          finishedTimestamp: after({
            timestamp: passedTest.finishedTimestamp!,
            delayMilliseconds: 2,
          }),
          statusId: flakyStatus,
        });

  const resolvedAutomationBugStatus =
    launchesCount - i <= 5
      ? DEFAULT_TEST_STATUSES.PASSED.id
      : DEFAULT_TEST_STATUSES.AUTOMATION_BUG.id;

  resolvedAutomationBugTest =
    resolvedAutomationBugTest === undefined
      ? await entities.tests.create({
          launchId: launch.id,
          testContextId: testContext.id,
          statusId: resolvedAutomationBugStatus,

          startedTimestamp: after({
            timestamp: flakyToInvestigateTest.finishedTimestamp!,
            delayMilliseconds: 1,
          }),
          finishedTimestamp: after({
            timestamp: flakyToInvestigateTest.finishedTimestamp!,
            delayMilliseconds: 2,
          }),
        })
      : await entities.tests.createBySample({
          sample: resolvedAutomationBugTest,
          context: testContext,
          statusId: resolvedAutomationBugStatus,

          startedTimestamp: after({
            timestamp: flakyToInvestigateTest.finishedTimestamp!,
            delayMilliseconds: 1,
          }),
          finishedTimestamp: after({
            timestamp: flakyToInvestigateTest.finishedTimestamp!,
            delayMilliseconds: 2,
          }),
        });

  productBugTest =
    productBugTest === undefined
      ? await entities.tests.create({
          launchId: launch.id,
          testContextId: testContext.id,
          statusId: DEFAULT_TEST_STATUSES.PRODUCT_BUG.id,
          startedTimestamp: after({
            timestamp: resolvedAutomationBugTest.finishedTimestamp!,
            delayMilliseconds: 1,
          }),
          finishedTimestamp: after({
            timestamp: resolvedAutomationBugTest.finishedTimestamp!,
            delayMilliseconds: 2,
          }),
        })
      : await entities.tests.createBySample({
          sample: productBugTest,
          context: testContext,
          statusId: DEFAULT_TEST_STATUSES.PRODUCT_BUG.id,
          startedTimestamp: after({
            timestamp: resolvedAutomationBugTest.finishedTimestamp!,
            delayMilliseconds: 1,
          }),
          finishedTimestamp: after({
            timestamp: resolvedAutomationBugTest.finishedTimestamp!,
            delayMilliseconds: 2,
          }),
        });

  systemIssueTest =
    systemIssueTest === undefined
      ? await entities.tests.create({
          launchId: launch.id,
          testContextId: testContext.id,
          statusId: DEFAULT_TEST_STATUSES.SYSTEM_ISSUE.id,
          startedTimestamp: after({
            timestamp: productBugTest.finishedTimestamp!,
            delayMilliseconds: 1,
          }),
          finishedTimestamp: after({
            timestamp: productBugTest.finishedTimestamp!,
            delayMilliseconds: 2,
          }),
        })
      : await entities.tests.createBySample({
          sample: systemIssueTest,
          context: testContext,
          statusId: DEFAULT_TEST_STATUSES.SYSTEM_ISSUE.id,
          startedTimestamp: after({
            timestamp: productBugTest.finishedTimestamp!,
            delayMilliseconds: 1,
          }),
          finishedTimestamp: after({
            timestamp: productBugTest.finishedTimestamp!,
            delayMilliseconds: 2,
          }),
        });

  noDefectTest =
    noDefectTest === undefined
      ? await entities.tests.create({
          launchId: launch.id,
          testContextId: testContext.id,
          statusId: DEFAULT_TEST_STATUSES.NO_DEFECT.id,
          startedTimestamp: after({
            timestamp: systemIssueTest.finishedTimestamp!,
            delayMilliseconds: 1,
          }),
          finishedTimestamp: after({
            timestamp: systemIssueTest.finishedTimestamp!,
            delayMilliseconds: 2,
          }),
        })
      : await entities.tests.createBySample({
          sample: noDefectTest,
          context: testContext,
          statusId: DEFAULT_TEST_STATUSES.NO_DEFECT.id,
          startedTimestamp: after({
            timestamp: systemIssueTest.finishedTimestamp!,
            delayMilliseconds: 1,
          }),
          finishedTimestamp: after({
            timestamp: systemIssueTest.finishedTimestamp!,
            delayMilliseconds: 2,
          }),
        });

  skippedTest =
    skippedTest === undefined
      ? await entities.tests.create({
          launchId: launch.id,
          testContextId: testContext.id,
          statusId: DEFAULT_TEST_STATUSES.SKIPPED.id,
          startedTimestamp: after({
            timestamp: noDefectTest.finishedTimestamp!,
            delayMilliseconds: 1,
          }),
          finishedTimestamp: after({
            timestamp: noDefectTest.finishedTimestamp!,
            delayMilliseconds: 2,
          }),
        })
      : await entities.tests.createBySample({
          sample: skippedTest,
          context: testContext,
          statusId: DEFAULT_TEST_STATUSES.SKIPPED.id,
          startedTimestamp: after({
            timestamp: noDefectTest.finishedTimestamp!,
            delayMilliseconds: 1,
          }),
          finishedTimestamp: after({
            timestamp: noDefectTest.finishedTimestamp!,
            delayMilliseconds: 2,
          }),
        });

  abortedTest =
    abortedTest === undefined
      ? await entities.tests.create({
          launchId: launch.id,
          testContextId: testContext.id,
          statusId: DEFAULT_TEST_STATUSES.ABORTED.id,
          startedTimestamp: after({
            timestamp: skippedTest.finishedTimestamp!,
            delayMilliseconds: 1,
          }),
          finishedTimestamp: after({
            timestamp: skippedTest.finishedTimestamp!,
            delayMilliseconds: 2,
          }),
        })
      : await entities.tests.createBySample({
          sample: abortedTest,
          context: testContext,
          statusId: DEFAULT_TEST_STATUSES.ABORTED.id,
          startedTimestamp: after({
            timestamp: skippedTest.finishedTimestamp!,
            delayMilliseconds: 1,
          }),
          finishedTimestamp: after({
            timestamp: skippedTest.finishedTimestamp!,
            delayMilliseconds: 2,
          }),
        });

  

  client.patchTestContext({
    params: { id: testContext.id },
    body: {
      finishedTimestamp: after({
        timestamp: abortedTest.finishedTimestamp!,
        delayMilliseconds: 1000,
      }),
    },
  });

  client.patchLaunch({
    params: { id: launch.id },
    body: {
      finishedTimestamp: after({
        timestamp: abortedTest.finishedTimestamp!,
        delayMilliseconds: 2000,
      }),
    },
  });
}
