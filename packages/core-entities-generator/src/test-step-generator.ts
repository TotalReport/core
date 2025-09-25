import { faker } from "@faker-js/faker";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferRequest } from "@ts-rest/core";
import { TestsGenerator } from "./test-generator.js";
import { ClientType } from "./types.js";
import { capitalizeFirstLetter } from "./utils-string.js";

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
  async create(args: GenerateTestStepArgs | undefined = undefined) {
    const testId =
      args?.testId ?? (await new TestsGenerator(this.client).create()).id;

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

    const response = await this.client.createTestStep({
      body: {
        testId: testId,
        title: title,
        ...args,
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

export type GenerateTestStepArgs = Partial<CreateTestStepRequest>;

export type CreateTestStepRequest = ClientInferRequest<
  typeof contract.createTestStep
>["body"];
