import { DEFAULT_TEST_STATUSES } from "@total-report/core-schema/constants";
import { expect } from "earl";
import { describe, test } from "mocha";
import { client } from "../../tools/client.js";
import "../../tools/earl-extensions.js";

describe("test statuses", () => {
  test("find all test statuses", async () => {
    const response = await client.findTestStatuses();

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        items: [
          {
            id: DEFAULT_TEST_STATUSES.PASSED.id,
            title: DEFAULT_TEST_STATUSES.PASSED.title,
            groupId: DEFAULT_TEST_STATUSES.PASSED.groupId,
            createdTimestamp: expect.a(String),
            color: expect.a(String),
          },
          {
            id: DEFAULT_TEST_STATUSES.PASSED_WITH_WARNING.id,
            title: DEFAULT_TEST_STATUSES.PASSED_WITH_WARNING.title,
            groupId: DEFAULT_TEST_STATUSES.PASSED.groupId,
            createdTimestamp: expect.a(String),
            color: expect.a(String),
          },
          {
            id: DEFAULT_TEST_STATUSES.FAILED.id,
            title: DEFAULT_TEST_STATUSES.FAILED.title,
            groupId: DEFAULT_TEST_STATUSES.FAILED.groupId,
            createdTimestamp: expect.a(String),
            color: expect.a(String),
          },
          {
            id: DEFAULT_TEST_STATUSES.PRODUCT_BUG.id,
            title: DEFAULT_TEST_STATUSES.PRODUCT_BUG.title,
            groupId: DEFAULT_TEST_STATUSES.PRODUCT_BUG.groupId,
            createdTimestamp: expect.a(String),
            color: expect.a(String),
          },
          {
            id: DEFAULT_TEST_STATUSES.AUTOMATION_BUG.id,
            title: DEFAULT_TEST_STATUSES.AUTOMATION_BUG.title,
            groupId: DEFAULT_TEST_STATUSES.AUTOMATION_BUG.groupId,
            createdTimestamp: expect.a(String),
            color: expect.a(String),
          },
          {
            id: DEFAULT_TEST_STATUSES.SYSTEM_ISSUE.id,
            title: DEFAULT_TEST_STATUSES.SYSTEM_ISSUE.title,
            groupId: DEFAULT_TEST_STATUSES.SYSTEM_ISSUE.groupId,
            createdTimestamp: expect.a(String),
            color: expect.a(String),
          },
          {
            id: DEFAULT_TEST_STATUSES.NO_DEFECT.id,
            title: DEFAULT_TEST_STATUSES.NO_DEFECT.title,
            groupId: DEFAULT_TEST_STATUSES.NO_DEFECT.groupId,
            createdTimestamp: expect.a(String),
            color: expect.a(String),
          },
          {
            id: DEFAULT_TEST_STATUSES.TO_INVESTIGATE.id,
            title: DEFAULT_TEST_STATUSES.TO_INVESTIGATE.title,
            groupId: DEFAULT_TEST_STATUSES.TO_INVESTIGATE.groupId,
            createdTimestamp: expect.a(String),
            color: expect.a(String),
          },
          {
            id: DEFAULT_TEST_STATUSES.SKIPPED.id,
            title: DEFAULT_TEST_STATUSES.SKIPPED.title,
            groupId: DEFAULT_TEST_STATUSES.SKIPPED.groupId,
            createdTimestamp: expect.a(String),
            color: expect.a(String),
          },
          {
            id: DEFAULT_TEST_STATUSES.ABORTED.id,
            title: DEFAULT_TEST_STATUSES.ABORTED.title,
            groupId: DEFAULT_TEST_STATUSES.ABORTED.groupId,
            createdTimestamp: expect.a(String),
            color: expect.a(String),
          },
        ],
      },
    });
  });

  test("read test status by id", async () => {
    const response = await client.readTestStatus({
      params: { id: DEFAULT_TEST_STATUSES.PASSED.id },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        id: DEFAULT_TEST_STATUSES.PASSED.id,
        title: DEFAULT_TEST_STATUSES.PASSED.title,
        groupId: DEFAULT_TEST_STATUSES.PASSED.groupId,
        createdTimestamp: expect.a(String),
        color: expect.a(String),
      },
    });
  });

  test("read test status with invalid id returns 404", async () => {
    const response = await client.readTestStatus({
      params: { id: "invalid-status-id" },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 404,
      body: {},
    });
  });
});
