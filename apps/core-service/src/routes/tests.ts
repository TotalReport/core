import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { TestsDAO } from "../db/tests.js";
import { TestEntity } from "../db-common/tests-common.js";
import { MD5 } from "object-hash";

export const createTestRoute: CreateTestRoute = async ({ body }) => {
  const request = {
    ...body,
    createdTimestamp: body.createdTimestamp ?? new Date(),
    correlationId: body.correlationId ?? MD5(body.title),
    argumentsHash: body.argumentsHash ?? MD5(body.arguments ?? null),
    externalArgumentsHash: body.externalArgumentsHash ?? MD5(body.externalArguments ?? null),
  };

  return {
    status: 201,
    body: convertToResponseBody(await new TestsDAO().create(request)),
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
  const { limit, offset, launchId, correlationId, argumentsHash } = query;
  const { items, totalItems } = await new TestsDAO().find({
    limit,
    offset,
    launchId,
    correlationId,
    argumentsHash,
  });

  return {
    status: 200,
    body: {
      pagination: {
        total: totalItems,
        limit,
        offset,
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
    title: response.title,
    createdTimestamp: response.createdTimestamp.toISOString(),
    startedTimestamp: response.startedTimestamp?.toISOString() ?? undefined,
    finishedTimestamp: response.finishedTimestamp?.toISOString() ?? undefined,
    statusId: response.statusId ?? undefined,
    argumentsHash: response.argumentsHash ?? undefined,
    externalArgumentsHash: response.externalArgumentsHash ?? undefined,
    arguments: response.arguments ?? undefined,
    externalArguments: response.externalArguments ?? undefined,
    correlationId: response.correlationId,
  };
};

type CreateTestRoute = AppRouteImplementation<typeof contract.createTest>;

type ReadTestRoute = AppRouteImplementation<typeof contract.readTest>;

type FindTestsRoute = AppRouteImplementation<typeof contract.findTests>;

type PatchTestRoute = AppRouteImplementation<typeof contract.patchTest>;

type DeleteTestRoute = AppRouteImplementation<typeof contract.deleteTest>;
