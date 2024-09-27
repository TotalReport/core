import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { BeforeTestEntity, BeforeTestsDAO } from "../db/before-tests.js";

export const createBeforeTestRoute: CreateBeforeTestRoute = async ({ body }) => {
  const request = {
    ...body,
    createdTimestamp: body.createdTimestamp ?? new Date(),
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

const convertToResponseBody = (response: BeforeTestEntity) => {
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

type CreateBeforeTestRoute = AppRouteImplementation<
  typeof contract.createBeforeTest
>;

type ReadBeforeTestRoute = AppRouteImplementation<
  typeof contract.readBeforeTest
>;
