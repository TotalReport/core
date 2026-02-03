import { contract } from "@total-report/core-contract/contract";
import {
  ServerInferResponseBody
} from "@ts-rest/core";
import { AppRouteImplementation } from "@ts-rest/express";
import { CreateTestArguments, TestEntity } from "../db-common/tests-common.js";
import { AfterTestsDAO } from "../db/after-tests.js";
import { MD5 } from "object-hash";

export const createAfterTestRoute: CreateAfterTestRoute = async ({ body }) => {
  const request: CreateTestArguments = {
    ...body,
    createdTimestamp: body.createdTimestamp ?? new Date(),
    correlationId: body.correlationId ?? MD5(body.title),
    argumentsHash: body.argumentsHash ?? MD5(body.arguments ?? null),
    externalArgumentsHash: body.externalArgumentsHash ?? MD5(body.externalArguments ?? null),
  };

  return {
    status: 201,
    body: convertToResponseBody(await new AfterTestsDAO().create(request)),
  };
};

export const readAfterTestRoute: ReadAfterTestRoute = async ({ params }) => {
  const { id } = params;
  const entity = await new AfterTestsDAO().findById(id);

  if (entity == undefined) {
    return { status: 404, body: {} };
  }

  return { status: 200, body: convertToResponseBody(entity) };
};

export const findAfterTestsRoute: FindAfterTestsRoute = async ({ query }) => {
  const { limit, offset, launchId, correlationId, argumentsHash } = query;
  const { items, totalItems } = await new AfterTestsDAO().find({
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

export const patchAfterTestRoute: PatchAfterTestRoute = async ({
  params,
  body,
}) => {
  let updatedAfterTest = await new AfterTestsDAO().patch({
    ...body,
    id: params.id,
  });

  return {
    status: 200,
    body: convertToResponseBody(updatedAfterTest),
  };
};

export const deleteAfterTestRoute: DeleteAfterTestRoute = async ({
  params,
}) => {
  await new AfterTestsDAO().deleteById(params.id);

  return { status: 204, body: undefined };
};

const convertToResponseBody = (response: TestEntity): AfterTestResponseBody => {
  return {
    launchId: response.launchId,
    id: response.id,
    title: response.title,
    createdTimestamp: response.createdTimestamp.toISOString(),
    startedTimestamp: response.startedTimestamp?.toISOString() ?? undefined,
    finishedTimestamp: response.finishedTimestamp?.toISOString() ?? undefined,
    statusId: response.statusId ?? undefined,
    argumentsHash: response.argumentsHash,
    externalArgumentsHash: response.externalArgumentsHash,
    arguments: response.arguments ?? undefined,
    correlationId: response.correlationId,
  };
};

type CreateAfterTestRoute = AppRouteImplementation<
  typeof contract.createAfterTest
>;

type ReadAfterTestRoute = AppRouteImplementation<typeof contract.readAfterTest>;

type FindAfterTestsRoute = AppRouteImplementation<
  typeof contract.findAfterTests
>;

type PatchAfterTestRoute = AppRouteImplementation<
  typeof contract.patchAfterTest
>;

type DeleteAfterTestRoute = AppRouteImplementation<
  typeof contract.deleteAfterTest
>;

type AfterTestResponseBody = ServerInferResponseBody<
  typeof contract.readAfterTest,
  200
>;
