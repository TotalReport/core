import { faker } from "@faker-js/faker";
import { BeforeTestsGenerator } from "./before-test-generator.js";
import { ClientType } from "./types.js";
import { assertEquals } from "./utils.js";
import { capitalizeFirstLetter } from "./utils-string.js";

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
  async create(args: CreateBeforeTestStepArgs | undefined = undefined) {
    const beforeTestId =
      args?.beforeTestId ??
      (await new BeforeTestsGenerator(this.client).create()).id;

    const title =
      args?.title ??
      capitalizeFirstLetter(faker.word.adjective() + " " + 
      faker.word.noun() + " " + 
      faker.word.verb() + " " + 
      faker.word.adverb());

    const response = await this.client.createBeforeTestStep({
      body: {
        beforeTestId: beforeTestId,
        title: title,
        createdTimestamp: args?.createdTimestamp,
        startedTimestamp: args?.startedTimestamp,
        finishedTimestamp: args?.finishedTimestamp,
        isSuccessful: args?.isSuccessful,
        errorMessage: args?.errorMessage,
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

/**
 * The arguments to create a before test step with.
 */
export type CreateBeforeTestStepArgs = {
  beforeTestId?: number;
  createdTimestamp?: Date;
  startedTimestamp?: Date;
  finishedTimestamp?: Date;
  title?: string;
  isSuccessful?: boolean;
  errorMessage?: string;
};
