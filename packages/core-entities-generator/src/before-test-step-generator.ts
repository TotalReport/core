import { faker } from "@faker-js/faker";
import { BeforeTestsGenerator } from "./before-test-generator.js";
import { ClientType } from "./types.js";
import { assertEquals } from "./utils.js";
import { capitalizeFirstLetter } from "./utils-string.js";
import { ClientInferRequest } from "@ts-rest/core";
import { contract } from "@total-report/core-contract/contract";

/**
 * This class is responsible for generating before test steps.
 */
export class BeforeTestStepsGenerator {
  client: ClientType;

  constructor(client: ClientType) {
    this.client = client;
  }

  /**
   * Creates a new before test step.
   *
   * @param args The arguments to create the before test step with.
   * @returns The created before test step.
   */
  async create(args: GenerateBeforeTestStepArgs | undefined = undefined) {
    const beforeTestId =
      args?.beforeTestId ??
      (await new BeforeTestsGenerator(this.client).create()).id;

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

    const response = await this.client.createBeforeTestStep({
      body: {
        beforeTestId: beforeTestId,
        title: title,
        ...args,
      },
    });

    assertEquals(
      response.status,
      201,
      `Failed to create before test step. Server response status ${response.status}, body ${JSON.stringify(response.body)}`
    );

    return response.body;
  }
}

export type GenerateBeforeTestStepArgs = Partial<CreateBeforeTestStepRequest>;

export type CreateBeforeTestStepRequest = ClientInferRequest<
  typeof contract.createBeforeTestStep
>["body"];
