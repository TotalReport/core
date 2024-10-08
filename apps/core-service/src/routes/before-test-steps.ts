import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { BeforeTestStepEntity, BeforeTestStepsDAO } from "../db/before-test-steps.js";
import { ClientInferResponseBody } from '@ts-rest/core';

export const createBeforeTestStep: CreateBeforeTestStepRoute = async ({ body }) => {
  const request = {
    ...body,
    createdTimestamp: body.createdTimestamp ?? new Date(),
  };

  return {
    status: 201,
    body: convertToResponseBody(await new BeforeTestStepsDAO().create(request)),
  };
};

export const readBeforeTestStep: ReadBeforeTestStepRoute = async ({ params }) => {
  const beforeTestStep = await new BeforeTestStepsDAO().findById(params.id);

  if (beforeTestStep == null) {
    return {
      status: 404,
      body: {
        message: "Before test step not found.",
      },
    };
  }

  return {
    status: 200,
    body: convertToResponseBody(beforeTestStep),
  };
}

type CreateBeforeTestStepRoute = AppRouteImplementation<
  typeof contract.createBeforeTestStep
>;

type ReadBeforeTestStepRoute = AppRouteImplementation<
  typeof contract.readBeforeTestStep
>;

type BeforeTestStepResponseBody = ClientInferResponseBody<typeof contract.readBeforeTestStep, 200> ;

export const convertToResponseBody = (beforeTestStep: BeforeTestStepEntity): BeforeTestStepResponseBody => {
  return {
    beforeTestId: beforeTestStep.beforeTestId,
    id: beforeTestStep.id,
    title: beforeTestStep.title,
    createdTimestamp: beforeTestStep.createdTimestamp.toISOString(),
    startedTimestamp: beforeTestStep.startedTimestamp?.toISOString(),
    finishedTimestamp: beforeTestStep.finishedTimestamp?.toISOString(),
    isSuccessful: beforeTestStep.isSuccessful == null ?? undefined,
    errorMessage: beforeTestStep.errorMessage ?? undefined,
  };
}
