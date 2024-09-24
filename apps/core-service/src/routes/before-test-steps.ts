import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { BeforeTestStepsDAO } from "../db/before-test-steps.js";

export const createBeforeTestStep: CreateBeforeTestStepRoute = async ({ body }) => {
  const request = {
    ...body,
    createdTimestamp: body.createdTimestamp ?? new Date().toISOString(),
  };

  return {
    status: 201,
    body: await new BeforeTestStepsDAO().create(request),
  };
};

type CreateBeforeTestStepRoute = AppRouteImplementation<
  typeof contract.createBeforeTestStep
>;
