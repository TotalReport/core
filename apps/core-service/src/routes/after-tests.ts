import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { AfterTestsDAO } from "../db/after-tests.js";

export const createAfterTest: CreateAfterTestRoute = async ({ body }) => {
  const request = {
    ...body,
    createdTimestamp: body.createdTimestamp ?? new Date().toISOString(),
  };

  return {
    status: 201,
    body: await new AfterTestsDAO().create(request),
  };
};

type CreateAfterTestRoute = AppRouteImplementation<
  typeof contract.createAfterTest
>;
