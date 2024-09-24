import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { TestContextsDAO } from "../db/test-contexts.js";

export const createTestContext: CreateTestContextRoute = async ({ body }) => {
  const request = {
    ...body,
    createdTimestamp: body.createdTimestamp ?? new Date().toISOString(),
  };

  return {
    status: 201,
    body: await new TestContextsDAO().create(request),
  };
};

type CreateTestContextRoute = AppRouteImplementation<
  typeof contract.createTestContext
>;
