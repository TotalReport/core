import { contract } from "@total-report/core-contract/contract";
import { ClientInferResponseBody, ServerInferRequest } from "@ts-rest/core";
import { AppRouteImplementation } from "@ts-rest/express";
import { AfterTestStepsDAO } from "../db/after-test-steps.js";
import { CreateTestStep, PatchTestStep, TestStepEntity } from "../db-common/test-steps-common.js";

export const createAfterTestStepRoute: CreateAfterTestStepRoute = async ({
  body,
}) => {
  const request = {
    ...body,
    createdTimestamp: body.createdTimestamp ?? new Date(),
  };

  const createAfterTestArgs = createRequestToCreateArgs({ body: request });

  return {
    status: 201,
    body: convertToResponseBody(
      await new AfterTestStepsDAO().create(createAfterTestArgs)
    ),
  };
};

export const readAfterTestStepRoute: ReadAfterTestStepRoute = async ({
  params,
}) => {
  const afterTestStep = await new AfterTestStepsDAO().findById(params.id);

  if (afterTestStep == null) {
    return {
      status: 404,
      body: {
        message: "After test step not found.",
      },
    };
  }

  return {
    status: 200,
    body: convertToResponseBody(afterTestStep),
  };
};

export const patchAfterTestStepRoute: PatchAfterTestStepRoute = async (
  request
) => {
  return {
    status: 200,
    body: convertToResponseBody(
      await new AfterTestStepsDAO().patch(patchRequestToPatchArgs(request))
    ),
  };
};

export const deleteAfterTestStepRoute: DeleteAfterTestStepRoute = async ({
  params,
}) => {
  await new AfterTestStepsDAO().deleteById(params.id);

  return {
    status: 204,
    body: undefined,
  };
};

type CreateAfterTestStepRoute = AppRouteImplementation<
  typeof contract.createAfterTestStep
>;

type ReadAfterTestStepRoute = AppRouteImplementation<
  typeof contract.readAfterTestStep
>;

type PatchAfterTestStepRoute = AppRouteImplementation<
  typeof contract.patchAfterTestStep
>;

type DeleteAfterTestStepRoute = AppRouteImplementation<
  typeof contract.deleteAfterTestStep
>;

type AfterTestStepResponseBody = ClientInferResponseBody<
  typeof contract.readAfterTestStep,
  200
>;

export const convertToResponseBody = (
  afterTestStep: TestStepEntity
): AfterTestStepResponseBody => {
  return {
    afterTestId: afterTestStep.testId,
    id: afterTestStep.id,
    title: afterTestStep.title,
    createdTimestamp: afterTestStep.createdTimestamp.toISOString(),
    startedTimestamp: afterTestStep.startedTimestamp?.toISOString(),
    finishedTimestamp: afterTestStep.finishedTimestamp?.toISOString(),
    isSuccessful: afterTestStep.isSuccessful,
    errorMessage: afterTestStep.errorMessage,
    process: afterTestStep.process,
    thread: afterTestStep.thread,
  };
};

type CreateAfterTestStepInput = Omit<
  ServerInferRequest<typeof contract.createAfterTestStep>,
  "body.createdTimestamp"
> & { body: { createdTimestamp: Date } };

type PatchAfterTestStepInput = ServerInferRequest<
  typeof contract.patchAfterTestStep
>;

type Override<
  Type,
  NewType extends { [key in keyof Type]?: NewType[key] },
> = Omit<Type, keyof NewType> & NewType;

const createRequestToCreateArgs = (
  input: CreateAfterTestStepInput
): CreateTestStep => {
  return {
    testId: input.body.afterTestId,
    title: input.body.title,
    createdTimestamp: input.body.createdTimestamp,
    startedTimestamp: input.body.startedTimestamp,
    finishedTimestamp: input.body.finishedTimestamp,
    isSuccessful: input.body.isSuccessful,
    errorMessage: input.body.errorMessage,
    process: input.body.process,
    thread: input.body.thread,
  };
};

const patchRequestToPatchArgs = (
  input: PatchAfterTestStepInput
): PatchTestStep => {
  return {
    id: input.params.id,
    title: input.body.title,
    createdTimestamp: input.body.createdTimestamp,
    startedTimestamp: input.body.startedTimestamp,
    finishedTimestamp: input.body.finishedTimestamp,
    isSuccessful: input.body.isSuccessful,
    errorMessage: input.body.errorMessage,
    process: input.body.process,
    thread: input.body.thread,
  };
};
