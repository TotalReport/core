import { faker } from "@faker-js/faker";
import { AfterTestsGenerator } from "./after-test-generator.js";
import { ClientType } from "./types.js";
import { assertEquals } from "./utils.js";
import { capitalizeFirstLetter } from "./utils-string.js";
import { ClientInferRequest } from "@ts-rest/core";
import { contract } from "@total-report/core-contract/contract";

/**
 * This class is responsible for generating after test steps.
 */
export class AfterTestStepsGenerator {
  client: ClientType;

  constructor(client: ClientType) {
    this.client = client;
  }

  /**
   * Creates a new after test step.
   *
   * @param args The arguments to create the after test step with.
   * @returns The created after test step.
   */
  async create(args: GenerateAfterTestStepArgs | undefined = undefined) {
    const afterTestId =
      args?.afterTestId ??
      (await new AfterTestsGenerator(this.client).create()).id;

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

    const response = await this.client.createAfterTestStep({
      body: {
        afterTestId: afterTestId,
        title: title,
        ...args,
      },
    });

    assertEquals(
      response.status,
      201,
      `Failed to create after test step. Server response status ${response.status}, body ${JSON.stringify(response.body)}`
    );

    return response.body;
  }
}

export type GenerateAfterTestStepArgs = Partial<CreateAfterTestStepRequest>;

export type CreateAfterTestStepRequest = ClientInferRequest<
  typeof contract.createAfterTestStep
>["body"];
