import { contract } from "@total-report/core-contract/contract";
import { PAGINATION_DEFAULTS } from "@total-report/core-contract/defaults";
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

export const findTestContextsByLaunchIdRoute: FindByLaunchIdRoute = async ({
  params,
  query,
}) => {
  const testContexts = await new TestContextsDAO().findByLaunchId(
    params.launchId,
    {
      limit: query.limit?? PAGINATION_DEFAULTS.limit,
      offset: query.offset?? PAGINATION_DEFAULTS.offset,
    }
  );

  return {
    status: 200,
    body: {
      items: testContexts.items.map((testContext) => ({
        ...testContext,
        parentTestContextId: testContext.parentTestContextId ?? undefined,
        createdTimestamp: testContext.createdTimestamp.toISOString(),
        startedTimestamp:
          testContext.startedTimestamp?.toISOString() ?? undefined,
        finishedTimestamp:
          testContext.finishedTimestamp?.toISOString() ?? undefined,
      })),
      pagination: {
        total: testContexts.pagination.total,
        limit: testContexts.pagination.limit,
        offset: testContexts.pagination.offset,
      },
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

type FindByLaunchIdRoute = AppRouteImplementation<
  typeof contract.findTestContextsByLaunchId
>;
