import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { TestEntity, TestsDAO } from "../db/tests.js";

export const createTestRoute: CreateTestRoute = async ({ body }) => {
  const request = {
    ...body,
    createdTimestamp: body.createdTimestamp ?? new Date(),
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

export const patchTestRoute: PatchTestRoute = async ({
  params,
  body,
}) => {
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

type CreateTestRoute = AppRouteImplementation<
  typeof contract.createTest
>;

type ReadTestRoute = AppRouteImplementation<
  typeof contract.readTest
>;

type PatchTestRoute = AppRouteImplementation<
  typeof contract.patchTest
>;

type DeleteTestRoute = AppRouteImplementation<
  typeof contract.deleteTest
>;
