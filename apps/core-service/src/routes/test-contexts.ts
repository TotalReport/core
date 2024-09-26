import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { TestContextsDAO } from "../db/test-contexts.js";

export const createTestContextRoute: CreateTestContextRoute = async ({
  body,
}) => {
  const request = {
    ...body,
    createdTimestamp: body.createdTimestamp ?? new Date(),
  };

  const createdTestContext = await new TestContextsDAO().create(request);

  return {
    status: 201,
    body: {
      ...createdTestContext,
      parentTestContextId: createdTestContext.parentTestContextId ?? undefined,
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

export const readTestContextRoute: ReadTestContextRoute = async ({
  params,
}) => {
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
      parentTestContextId: testContext.parentTestContextId ?? undefined,
      createdTimestamp: testContext.createdTimestamp.toISOString(),
      startedTimestamp:
        testContext.startedTimestamp?.toISOString() ?? undefined,
      finishedTimestamp:
        testContext.finishedTimestamp?.toISOString() ?? undefined,
    },
  };
};

export const patchTestContextRoute: PatchTestContextRoute = async ({
  params,
  body,
}) => {
  let testContext = await new TestContextsDAO().patch({
    ...body,
    id: params.id,
  });

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
      parentTestContextId: testContext.parentTestContextId ?? undefined,
      createdTimestamp: testContext.createdTimestamp.toISOString(),
      startedTimestamp:
        testContext.startedTimestamp?.toISOString() ?? undefined,
      finishedTimestamp:
        testContext.finishedTimestamp?.toISOString() ?? undefined,
    },
  };
};

export const deleteTestContextRoute: DeleteTestContextRoute = async ({
  params,
}) => {
  await new TestContextsDAO().deleteById(params.id);
  return {
    status: 204,
    body: undefined,
  };
};

type CreateTestContextRoute = AppRouteImplementation<
  typeof contract.createTestContext
>;

type ReadTestContextRoute = AppRouteImplementation<
  typeof contract.readTestContext
>;

type PatchTestContextRoute = AppRouteImplementation<
  typeof contract.patchTestContext
>;

type DeleteTestContextRoute = AppRouteImplementation<
  typeof contract.deleteTestContext
>;
