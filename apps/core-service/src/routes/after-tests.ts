import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { AfterTestEntity, AfterTestsDAO } from "../db/after-tests.js";

export const createAfterTestRoute: CreateAfterTestRoute = async ({ body }) => {
  const request = {
    ...body,
    createdTimestamp: body.createdTimestamp ?? new Date(),
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

export const deleteAfterTestRoute: DeleteAfterTestRoute = async ({ params }) => {
  await new AfterTestsDAO().deleteById(params.id);

  return { status: 204, body: undefined };
};

const convertToResponseBody = (response: AfterTestEntity) => {
  return {
    id: response.id,
    title: response.title,
    createdTimestamp: response.createdTimestamp.toISOString(),
    startedTimestamp: response.startedTimestamp?.toISOString(),
    finishedTimestamp: response.finishedTimestamp?.toISOString(),
    launchId: response.launchId,
    testContextId: response.testContextId,
    statusId: response.statusId,
    argumentsHash: response.argumentsHash,
    arguments: response.arguments
  };
};

type CreateAfterTestRoute = AppRouteImplementation<
  typeof contract.createAfterTest
>;

type ReadAfterTestRoute = AppRouteImplementation<
  typeof contract.readAfterTest
>;

type PatchAfterTestRoute = AppRouteImplementation<
  typeof contract.patchAfterTest
>;

type DeleteAfterTestRoute = AppRouteImplementation<
  typeof contract.deleteAfterTest
>;