import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import {
  TestStepsDAO,
} from "../db/test-steps.js";
import { ClientInferResponseBody } from "@ts-rest/core";
import { ServerInferRequest, ServerInferResponses } from "@ts-rest/core";
import { CreateTestStep, PatchTestStep, TestStepEntity } from "../db-common/test-steps-common.js";

export const createTestStepRoute: CreateTestStepRoute = async ({
  body,
}) => {
  const request = {
    ...body,
    createdTimestamp: body.createdTimestamp ?? new Date(),
  };

  const createTestArgs = createRequestToCreateArgs({ body: request });

  return {
    status: 201,
    body: convertToResponseBody(
      await new TestStepsDAO().create(createTestArgs)
    ),
  };
};

export const readTestStepRoute: ReadTestStepRoute = async ({
  params,
}) => {
  const testStep = await new TestStepsDAO().findById(params.id);

  if (testStep == null) {
    return {
      status: 404,
      body: {
        message: "Test step not found.",
      },
    };
  }

  return {
    status: 200,
    body: convertToResponseBody(testStep),
  };
};

export const patchTestStepRoute: PatchTestStepRoute = async (
  request
) => {
  return {
    status: 200,
    body: convertToResponseBody(
      await new TestStepsDAO().patch(patchRequestToPatchArgs(request))
    ),
  };
};

export const deleteTestStepRoute: DeleteTestStepRoute = async ({
  params,
}) => {
  await new TestStepsDAO().deleteById(params.id);

  return {
    status: 204,
    body: undefined,
  };
};

type CreateTestStepRoute = AppRouteImplementation<
  typeof contract.createTestStep
>;

type ReadTestStepRoute = AppRouteImplementation<
  typeof contract.readTestStep
>;

type PatchTestStepRoute = AppRouteImplementation<
  typeof contract.patchTestStep
>;

type DeleteTestStepRoute = AppRouteImplementation<
  typeof contract.deleteTestStep
>;

type TestStepResponseBody = ClientInferResponseBody<
  typeof contract.readTestStep,
  200
>;

export const convertToResponseBody = (
  testStep: TestStepEntity
): TestStepResponseBody => {
  return {
    testId: testStep.testId,
    id: testStep.id,
    title: testStep.title,
    createdTimestamp: testStep.createdTimestamp.toISOString(),
    startedTimestamp: testStep.startedTimestamp?.toISOString(),
    finishedTimestamp: testStep.finishedTimestamp?.toISOString(),
    isSuccessful: testStep.isSuccessful,
    errorMessage: testStep.errorMessage,
    process: testStep.process,
    thread: testStep.thread,
  };
};

type CreateTestStepInput = Omit<
  ServerInferRequest<typeof contract.createTestStep>,
  "body.createdTimestamp"
> & { body: { createdTimestamp: Date } };

type PatchTestStepInput = ServerInferRequest<
  typeof contract.patchTestStep
>;

const createRequestToCreateArgs = (
  input: CreateTestStepInput
): CreateTestStep => {
  return {
    testId: input.body.testId,
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
  input: PatchTestStepInput
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
