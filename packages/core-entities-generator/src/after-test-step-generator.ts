import { faker } from "@faker-js/faker";
import { AfterTestsGenerator } from "./after-test-generator.js";
import { ClientType } from "./types.js";
import { assertEquals } from "./utils.js";

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
  async create(args: CreateAfterTestStepArgs | undefined = undefined) {
    const afterTestId = args?.afterTestId ?? (await new AfterTestsGenerator(this.client).create()).id;
    
    const title =
      args?.title ??
      faker.word.noun() + " " + faker.word.verb() + " " + faker.date.recent();

    const response = await this.client.createAfterTestStep({
      body: {
        afterTestId: afterTestId,
        title: title,
        createdTimestamp: args?.createdTimestamp,
        startedTimestamp: args?.startedTimestamp,
        finishedTimestamp: args?.finishedTimestamp,
        isSuccessful: args?.isSuccessful,
        errorMessage: args?.errorMessage
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

/**
 * The arguments to create an after test step with.
 */
export type CreateAfterTestStepArgs = {
  afterTestId?: number;
  createdTimestamp?: Date;
  startedTimestamp?: Date;
  finishedTimestamp?: Date;
  title?: string;
  isSuccessful?: boolean;
  errorMessage?: string;
};
