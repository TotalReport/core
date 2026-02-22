import { contract } from "@total-report/core-contract/contract";
import { ClientInferResponseBody, ServerInferRequest } from "@ts-rest/core";
import { AppRouteImplementation } from "@ts-rest/express";
import {
  PatchTestStep,
  TestStepEntity,
  TestStepsDAO
} from "../db/test-steps.js";

export const createTestStepRoute: CreateTestStepRoute = async ({ body }) => {
  const createdStep = await new TestStepsDAO().create({
    testId: body.testId,
    title: body.title,
    startedTimestamp: body.startedTimestamp,
    finishedTimestamp: body.finishedTimestamp,
    isSuccessful: body.isSuccessful,
    errorMessage: body.errorMessage,
    process: body.process,
    thread: body.thread,
  });
  
  return {
    status: 201,
    body: convertToResponseBody(createdStep),
  };
};

export const readTestStepRoute: ReadTestStepRoute = async ({ params }) => {
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

export const findTestStepsRoute: FindTestStepsRoute = async ({ query }) => {
  const testSteps = await new TestStepsDAO().findByTestId(query.testId);

  return {
    status: 200,
    body: testSteps.map((step) => convertToResponseBody(step)),
  };
};

export const patchTestStepRoute: PatchTestStepRoute = async (request) => {
  return {
    status: 200,
    body: convertToResponseBody(
      await new TestStepsDAO().patch(patchRequestToPatchArgs(request)),
    ),
  };
};

export const deleteTestStepRoute: DeleteTestStepRoute = async ({ params }) => {
  await new TestStepsDAO().deleteById(params.id);

  return {
    status: 204,
    body: undefined,
  };
};

type CreateTestStepRoute = AppRouteImplementation<
  typeof contract.createTestStep
>;

type ReadTestStepRoute = AppRouteImplementation<typeof contract.readTestStep>;

type FindTestStepsRoute = AppRouteImplementation<typeof contract.findTestSteps>;

type PatchTestStepRoute = AppRouteImplementation<typeof contract.patchTestStep>;

type DeleteTestStepRoute = AppRouteImplementation<
  typeof contract.deleteTestStep
>;

type TestStepResponseBody = ClientInferResponseBody<
  typeof contract.readTestStep,
  200
>;

export const convertToResponseBody = (
  testStep: TestStepEntity,
): TestStepResponseBody => {
  return {
    testId: testStep.testId,
    id: testStep.id,
    title: testStep.title,
    startedTimestamp: testStep.startedTimestamp.toISOString(),
    finishedTimestamp: testStep.finishedTimestamp?.toISOString(),
    isSuccessful: testStep.isSuccessful,
    errorMessage: testStep.errorMessage,
    process: testStep.process,
    thread: testStep.thread,
  };
};

type PatchTestStepInput = ServerInferRequest<typeof contract.patchTestStep>;

const patchRequestToPatchArgs = (input: PatchTestStepInput): PatchTestStep => {
  return {
    id: input.params.id,
    title: input.body.title,
    startedTimestamp: input.body.startedTimestamp,
    finishedTimestamp: input.body.finishedTimestamp,
    isSuccessful: input.body.isSuccessful,
    errorMessage: input.body.errorMessage,
    process: input.body.process,
    thread: input.body.thread,
  };
};
