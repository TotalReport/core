import { faker } from "@faker-js/faker";
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
  async create(args: CreateTestStepArgs | undefined = undefined) {
    const testId = args?.testId ?? (await new TestsGenerator(this.client).create()).id;
    
    const title =
      args?.title ??
      capitalizeFirstLetter(faker.word.adjective() + " " + 
      faker.word.noun() + " " + 
      faker.word.verb() + " " + 
      faker.word.adverb());

    const response = await this.client.createTestStep({
      body: {
        testId: testId,
        title: title,
        createdTimestamp: args?.createdTimestamp,
        startedTimestamp: args?.startedTimestamp,
        finishedTimestamp: args?.finishedTimestamp,
        isSuccessful: args?.isSuccessful,
        errorMessage: args?.errorMessage
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

/**
 * The arguments to create a test step with.
 */
export type CreateTestStepArgs = {
  testId?: number;
  createdTimestamp?: Date;
  startedTimestamp?: Date;
  finishedTimestamp?: Date;
  title?: string;
  isSuccessful?: boolean;
  errorMessage?: string;
};
