import { faker } from "@faker-js/faker";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferRequest } from "@ts-rest/core";
import { ClientType } from "./types.js";
import { capitalizeFirstLetter } from "./utils-string.js";
import { firstDefined } from "./utils.js";

/**
 * This class is responsible for generating test steps.
 */
export class TestStepsGenerator {
  client: ClientType;

  constructor(client: ClientType) {
    this.client = client;
  }

  /**
   * Creates a new test step.
   *
   * @param args The arguments to create the test step with.
   * @returns The created test step.
   */
  async create(args: GenerateTestStepArgs) {
    const title =
      args?.title ??
      capitalizeFirstLetter(
        faker.word.adjective() +
          " " +
          faker.word.noun() +
          " " +
          faker.word.verb() +
          " " +
          faker.word.adverb()
      );

    const startedTimestamp = firstDefined(
      args?.startedTimestamp,
      args?.finishedTimestamp,
      new Date(),
    );

    const response = await this.client.createTestStep({
      body: {
        title: title,
        ...args,
        startedTimestamp: startedTimestamp,
      },
    });
    if (response.status !== 201) {
      throw new Error(
        `Failed to create test step. Server response status ${response.status} body ${JSON.stringify(response.body)}`
      );
    }
    return response.body;
  }
}

export type GenerateTestStepArgs = Partial<CreateTestStepRequest> & Pick<CreateTestStepRequest, "testId">;

export type CreateTestStepRequest = ClientInferRequest<
  typeof contract.createTestStep
>["body"];
