import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import {
  BeforeTestStepEntity,
  BeforeTestStepsDAO,
  CreateBeforeTestStep,
  PatchBeforeTestStep,
} from "../db/before-test-steps.js";
import { ClientInferResponseBody } from "@ts-rest/core";
import { ServerInferRequest, ServerInferResponses } from "@ts-rest/core";

export const createBeforeTestStepRoute: CreateBeforeTestStepRoute = async ({
  body,
}) => {
  const request = {
    ...body,
    createdTimestamp: body.createdTimestamp ?? new Date(),
  };

  const createBeforeTestArgs = createRequestToCreateArgs({ body: request });

  return {
    status: 201,
    body: convertToResponseBody(
      await new BeforeTestStepsDAO().create(createBeforeTestArgs)
    ),
  };
};

export const readBeforeTestStepRoute: ReadBeforeTestStepRoute = async ({
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

export const patchBeforeTestStepRoute: PatchBeforeTestStepRoute = async (
  request
) => {
  return {
    status: 200,
    body: convertToResponseBody(
      await new BeforeTestStepsDAO().patch(patchRequestToPatchArgs(request))
    ),
  };
};

export const deleteBeforeTestStepRoute: DeleteBeforeTestStepRoute = async ({
  params,
}) => {
  await new BeforeTestStepsDAO().deleteById(params.id);

  return {
    status: 204,
    body: undefined,
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

type DeleteBeforeTestStepRoute = AppRouteImplementation<
  typeof contract.deleteBeforeTestStep
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

type CreateBeforeTestStepInput = Omit<
  ServerInferRequest<typeof contract.createBeforeTestStep>,
  "body.createdTimestamp"
> & { body: { createdTimestamp: Date } };

type PatchBeforeTestStepInput = ServerInferRequest<
  typeof contract.patchBeforeTestStep
>;

type Override<
  Type,
  NewType extends { [key in keyof Type]?: NewType[key] },
> = Omit<Type, keyof NewType> & NewType;

const createRequestToCreateArgs = (
  input: CreateBeforeTestStepInput
): CreateBeforeTestStep => {
  return {
    beforeTestId: input.body.beforeTestId,
    title: input.body.title,
    createdTimestamp: input.body.createdTimestamp,
    startedTimestamp: input.body.startedTimestamp,
    finishedTimestamp: input.body.finishedTimestamp,
    isSuccessful: input.body.isSuccessful,
    errorMessage: input.body.errorMessage,
  };
};

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
