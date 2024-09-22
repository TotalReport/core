import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { BeforeTestsDAO } from "../db/before-tests.js";

export const createBeforeTest: CreateBeforeTestRoute = async ({ body }) => {
  const request = {
    ...body,
    createdTimestamp: body.createdTimestamp ?? new Date().toISOString(),
  };

  return {
    status: 201,
    body: await new BeforeTestsDAO().create(request),
  };
};

type CreateBeforeTestRoute = AppRouteImplementation<
  typeof contract.createBeforeTest
>;
