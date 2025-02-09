import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { TestsDAO } from "../db/tests.js";
import { TestEntity } from "../db-common/tests-common.js";
import { MD5 } from "object-hash";

export const createTestRoute: CreateTestRoute = async ({ body }) => {
  const request = {
    ...body,
    createdTimestamp: body.createdTimestamp ?? new Date(),
    correlationId: body.correlationId ?? MD5(body.correlationId ?? null),
    argumentsHash: body.argumentsHash ?? MD5(body.arguments ?? null),
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
    testContextId: response.testContextId ?? undefined,
    id: response.id,
    title: response.title,
    createdTimestamp: response.createdTimestamp.toISOString(),
    startedTimestamp: response.startedTimestamp?.toISOString() ?? undefined,
    finishedTimestamp: response.finishedTimestamp?.toISOString() ?? undefined,
    statusId: response.statusId ?? undefined,
    argumentsHash: response.argumentsHash ?? undefined,
    arguments: response.arguments ?? undefined,
    correlationId: response.correlationId,
  };
};

type CreateTestRoute = AppRouteImplementation<typeof contract.createTest>;

type ReadTestRoute = AppRouteImplementation<typeof contract.readTest>;

type PatchTestRoute = AppRouteImplementation<typeof contract.patchTest>;

type DeleteTestRoute = AppRouteImplementation<typeof contract.deleteTest>;
