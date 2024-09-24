import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { AfterTestStepsDAO } from "../db/after-test-steps.js";

export const createAfterTestStep: CreateAfterTestStepRoute = async ({ body }) => {
  const request = {
    ...body,
    createdTimestamp: body.createdTimestamp ?? new Date().toISOString(),
  };

  return {
    status: 201,
    body: await new AfterTestStepsDAO().create(request),
  };
};

type CreateAfterTestStepRoute = AppRouteImplementation<
  typeof contract.createAfterTestStep
>;
