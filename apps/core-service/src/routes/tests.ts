import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { TestContextsDAO } from "../db/test-contexts.js";
import { TestsDAO } from "../db/tests.js";

export const createTest: CreateTestRoute = async ({ body }) => {
  const request = {
    ...body,
    createdTimestamp: body.createdTimestamp ?? new Date().toISOString(),
  };

  return {
    status: 201,
    body: await new TestsDAO().create(request),
  };
};

type CreateTestRoute = AppRouteImplementation<typeof contract.createTest>;
