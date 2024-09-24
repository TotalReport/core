import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { TestStepsDAO } from "../db/test-steps.js";

export const createTestStep: CreateTestStepRoute = async ({ body }) => {
  const request = {
    ...body,
    createdTimestamp: body.createdTimestamp ?? new Date().toISOString(),
  };

  return {
    status: 201,
    body: await new TestStepsDAO().create(request),
  };
};

type CreateTestStepRoute = AppRouteImplementation<
  typeof contract.createTestStep
>;
