import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { TestEntity, TestsDAO } from "../db/tests.js";
import { MD5 } from "object-hash";

export const createTestRoute: CreateTestRoute = async ({ body }) => {
  const request = {
    ...body,
    correlationId: body.correlationId ?? MD5(body.title),
    argumentsHash: body.argumentsHash ?? MD5(body.arguments ?? null),
    externalArgumentsHash:
      body.externalArgumentsHash ?? MD5(body.externalArguments ?? null),
  };

  console.log("Create test request", request);

  const createdTest = await new TestsDAO().create(request);

  console.log("Created test", createdTest);

  return {
    status: 201,
    body: convertToResponseBody(createdTest),
  };
};

export const readTestRoute: ReadTestRoute = async ({ params }) => {
  const { id } = params;
  const entity = await new TestsDAO().findById(id);

  if (entity == undefined) {
    return { status: 404, body: {} };
  }

  return { status: 200, body: convertToResponseBody(entity) };
};

export const findTestsRoute: FindTestsRoute = async ({ query }) => {
  const {
    offset,
    limit,
    distinct,
    "title~cnt": titleContains,
    launchId,
    correlationId,
    argumentsHash,
    externalArgumentsHash,
    entityTypes,
    statusIds
  } = query;
  const { items, pagination } = await new TestsDAO().find(
    {
      distinct,
      titleContains,
      launchId,
      correlationId,
      argumentsHash,
      externalArgumentsHash,
      entityTypes,
      statusIds
    },
    { limit, offset },
  );

  return {
    status: 200,
    body: {
      pagination: {
        total: pagination.total,
        limit: pagination.limit,
        offset: pagination.offset,
      },
      items: items.map(convertToResponseBody),
    },
  };
};

export const patchTestRoute: PatchTestRoute = async ({ params, body }) => {
  let updatedTest = await new TestsDAO().patch({
    ...body,
    id: params.id,
  });

  return {
    status: 200,
    body: convertToResponseBody(updatedTest),
  };
};

export const deleteTestRoute: DeleteTestRoute = async ({ params }) => {
  await new TestsDAO().deleteById(params.id);

  return { status: 204, body: undefined };
};

const convertToResponseBody = (response: TestEntity) => {
  return {
    launchId: response.launchId,
    id: response.id,
    entityType: response.entityType,
    title: response.title,
    startedTimestamp: response.startedTimestamp.toISOString(),
    finishedTimestamp: response.finishedTimestamp?.toISOString() ?? undefined,
    statusId: response.statusId ?? undefined,
    argumentsHash: response.argumentsHash,
    externalArgumentsHash: response.externalArgumentsHash,
    arguments: response.arguments,
    externalArguments: response.externalArguments,
    correlationId: response.titleHash,
  };
};

export const findTestEntitiesCountsByStatusesRoute: FindTestEntitiesStatusesCountsByStatusesRoute =
  async ({ query }) => {
    const search = {
      launchId: query.launchId,
      distinct: query.distinct,
    };

    const searchResults = await new TestsDAO().countsByStatuses(search);

    return {
      status: 200,
      body: searchResults.map((item) => {
        return {
          ...item,
        };
      }),
    };
  };

export type FindTestEntitiesStatusesCountsByStatusesRoute =
  AppRouteImplementation<typeof contract.findTestEntitiesCountsByStatuses>;

type CreateTestRoute = AppRouteImplementation<typeof contract.createTest>;

type ReadTestRoute = AppRouteImplementation<typeof contract.readTest>;

type FindTestsRoute = AppRouteImplementation<typeof contract.findTests>;

type PatchTestRoute = AppRouteImplementation<typeof contract.patchTest>;

type DeleteTestRoute = AppRouteImplementation<typeof contract.deleteTest>;
