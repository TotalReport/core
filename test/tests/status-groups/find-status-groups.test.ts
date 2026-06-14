import { TEST_STATUS_GROUPS } from "@total-report/core-schema/constants";
import { expect } from "earl";
import { describe, test } from "mocha";
import { loginVerifiedTestUser } from "../../tools/auth.js";
import type { VerifiedTestUserSession } from "../../tools/auth.js";
import "../../tools/earl-extensions.js";

describe("status groups", () => {
  let client: VerifiedTestUserSession["client"];

  before(async () => {
    ({ client } = await loginVerifiedTestUser());
  });

  test("find all status groups", async () => {
    const response = await client.findTestStatusGroups();

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        items: expect.equalUnsorted([
          {
            id: TEST_STATUS_GROUPS.PASSED_GROUP.id,
            title: TEST_STATUS_GROUPS.PASSED_GROUP.title,
            createdTimestamp: expect.a(String),
            color: expect.a(String),
          },
          {
            id: TEST_STATUS_GROUPS.FAILED_GROUP.id,
            title: TEST_STATUS_GROUPS.FAILED_GROUP.title,
            createdTimestamp: expect.a(String),
            color: expect.a(String),
          },
          {
            id: TEST_STATUS_GROUPS.SKIPPED_GROUP.id,
            title: TEST_STATUS_GROUPS.SKIPPED_GROUP.title,
            createdTimestamp: expect.a(String),
            color: expect.a(String),
          },
        ]),
      },
    });
  });

  test("read status group by id", async () => {
    const response = await client.readTestStatusGroup({
      params: { id: TEST_STATUS_GROUPS.PASSED_GROUP.id },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 200,
      body: {
        id: TEST_STATUS_GROUPS.PASSED_GROUP.id,
        title: TEST_STATUS_GROUPS.PASSED_GROUP.title,
        createdTimestamp: expect.a(String),
        color: expect.a(String),
      },
    });
  });

  test("read status group with invalid id returns 404", async () => {
    const response = await client.readTestStatusGroup({
      params: { id: "invalid-group-id" },
    });

    expect(response).toEqual({
      headers: expect.anything(),
      status: 404,
      body: {},
    });
  });
});
