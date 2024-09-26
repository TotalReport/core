import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { TestContextsDAO } from "../db/test-contexts.js";

export const createTestContext: CreateTestContextRoute = async ({ body }) => {
  const request = {
    ...body,
    createdTimestamp: body.createdTimestamp ?? new Date(),
  };

  const createdTestContext = await new TestContextsDAO().create(request);

  return {
    status: 201,
    body: {
      ...createdTestContext,
      createdTimestamp: createdTestContext.createdTimestamp.toISOString(),
      startedTimestamp: createdTestContext.startedTimestamp
        ? createdTestContext.startedTimestamp.toISOString()
        : undefined,
      finishedTimestamp: createdTestContext.finishedTimestamp
        ? createdTestContext.finishedTimestamp.toISOString()
        : undefined,
    },
  };
};

export const readTestContext: ReadTestContextRoute = async ({ params }) => {
  const testContext = await new TestContextsDAO().findById(params.id);

  if (testContext === undefined) {
    return {
      status: 404,
      body: {},
    };
  }

  return {
    status: 200,
    body: {
      ...testContext,
      createdTimestamp: testContext.createdTimestamp.toISOString(),
      startedTimestamp: testContext.startedTimestamp
        ? testContext.startedTimestamp.toISOString()
        : undefined,
      finishedTimestamp: testContext.finishedTimestamp
        ? testContext.finishedTimestamp.toISOString()
        : undefined,
    },
  };
};

type CreateTestContextRoute = AppRouteImplementation<
  typeof contract.createTestContext
>;

type ReadTestContextRoute = AppRouteImplementation<
  typeof contract.readTestContext
>;
