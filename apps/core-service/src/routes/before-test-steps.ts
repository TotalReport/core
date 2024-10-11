import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import {
  BeforeTestStepEntity,
  BeforeTestStepsDAO,
  PatchBeforeTestStep,
} from "../db/before-test-steps.js";
import { ClientInferResponseBody } from "@ts-rest/core";
import { ServerInferRequest, ServerInferResponses } from "@ts-rest/core";

export const createBeforeTestStep: CreateBeforeTestStepRoute = async ({
  body,
}) => {
  const request = {
    ...body,
    createdTimestamp: body.createdTimestamp ?? new Date(),
  };

  return {
    status: 201,
    body: convertToResponseBody(await new BeforeTestStepsDAO().create(request)),
  };
};

export const readBeforeTestStep: ReadBeforeTestStepRoute = async ({
  params,
}) => {
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
};

export const patchBeforeTestStep: PatchBeforeTestStepRoute = async (
  request
) => {
  return {
    status: 200,
    body: convertToResponseBody(
      await new BeforeTestStepsDAO().patch(patchRequestToPatchArgs(request))
    ),
  };
};

type CreateBeforeTestStepRoute = AppRouteImplementation<
  typeof contract.createBeforeTestStep
>;

type ReadBeforeTestStepRoute = AppRouteImplementation<
  typeof contract.readBeforeTestStep
>;

type PatchBeforeTestStepRoute = AppRouteImplementation<
  typeof contract.patchBeforeTestStep
>;

type BeforeTestStepResponseBody = ClientInferResponseBody<
  typeof contract.readBeforeTestStep,
  200
>;

export const convertToResponseBody = (
  beforeTestStep: BeforeTestStepEntity
): BeforeTestStepResponseBody => {
  return {
    beforeTestId: beforeTestStep.beforeTestId,
    id: beforeTestStep.id,
    title: beforeTestStep.title,
    createdTimestamp: beforeTestStep.createdTimestamp.toISOString(),
    startedTimestamp: beforeTestStep.startedTimestamp?.toISOString(),
    finishedTimestamp: beforeTestStep.finishedTimestamp?.toISOString(),
    isSuccessful: beforeTestStep.isSuccessful,
    errorMessage: beforeTestStep.errorMessage,
  };
};

type PatchBeforeTestStepInput = ServerInferRequest<
  typeof contract.patchBeforeTestStep
>;

const patchRequestToPatchArgs = (
  input: PatchBeforeTestStepInput
): PatchBeforeTestStep => {
  return {
    id: input.params.id,
    title: input.body.title,
    createdTimestamp: input.body.createdTimestamp,
    startedTimestamp: input.body.startedTimestamp,
    finishedTimestamp: input.body.finishedTimestamp,
    isSuccessful: input.body.isSuccessful,
    errorMessage: input.body.errorMessage,
  };
};
