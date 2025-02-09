import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { BeforeTestsDAO } from "../db/before-tests.js";
import { TestEntity } from "../db-common/tests-common.js";
import { ServerInferResponseBody } from "@ts-rest/core";
import { MD5 } from "object-hash";

export const createBeforeTestRoute: CreateBeforeTestRoute = async ({
  body,
}) => {
  const request = {
    ...body,
    createdTimestamp: body.createdTimestamp ?? new Date(),
    correlationId: body.correlationId ?? MD5(body.correlationId ?? null),
    argumentsHash: body.argumentsHash ?? MD5(body.arguments ?? null),
  };

  return {
    status: 201,
    body: convertToResponseBody(await new BeforeTestsDAO().create(request)),
  };
};

export const readBeforeTestRoute: ReadBeforeTestRoute = async ({ params }) => {
  const { id } = params;
  const entity = await new BeforeTestsDAO().findById(id);

  if (entity == undefined) {
    return { status: 404, body: {} };
  }

  return { status: 200, body: convertToResponseBody(entity) };
};

export const patchBeforeTestRoute: PatchBeforeTestRoute = async ({
  params,
  body,
}) => {
  let updatedBeforeTest = await new BeforeTestsDAO().patch({
    ...body,
    id: params.id,
  });

  return {
    status: 200,
    body: convertToResponseBody(updatedBeforeTest),
  };
};

export const deleteBeforeTestRoute: DeleteBeforeTestRoute = async ({
  params,
}) => {
  await new BeforeTestsDAO().deleteById(params.id);

  return { status: 204, body: undefined };
};

const convertToResponseBody = (
  response: TestEntity
): BeforeTestResponseBody => {
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

type CreateBeforeTestRoute = AppRouteImplementation<
  typeof contract.createBeforeTest
>;

type ReadBeforeTestRoute = AppRouteImplementation<
  typeof contract.readBeforeTest
>;

type PatchBeforeTestRoute = AppRouteImplementation<
  typeof contract.patchBeforeTest
>;

type DeleteBeforeTestRoute = AppRouteImplementation<
  typeof contract.deleteBeforeTest
>;

type BeforeTestResponseBody = ServerInferResponseBody<
  typeof contract.readBeforeTest,
  200
>;
