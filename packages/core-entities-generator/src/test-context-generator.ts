import { faker } from "@faker-js/faker";
import { ClientType } from "./types.js";
import { LaunchesGenerator } from "./launch-generator.js";
import { assertEquals } from "./utils.js";

/**
 * This class is responsible for generating test contexts.
 */
export class TestContextsGenerator {
  client: ClientType;

  constructor(client: ClientType) {
    this.client = client;
  }

  /**
   * Creates a new test context.
   * 
   * @param args The arguments to create the test context with.
   * @returns The created test context.
   */
  async create(args: CreateTestContext | undefined = undefined) {
    const launchId = args?.launchId ?? (await new LaunchesGenerator(this.client).create()).id;

    const title =
      args?.title ??
      faker.word.adjective() + " " + 
      faker.word.noun() + " " + 
      faker.word.verb() + " " + 
      faker.word.adverb();

    const response = await this.client.createTestContext({
      body: {
        parentTestContextId: args?.parentTestContextId,
        launchId: launchId,
        title: title,
        createdTimestamp: args?.createdTimestamp,
        startedTimestamp: args?.startedTimestamp,
        finishedTimestamp: args?.finishedTimestamp,
      },
    });

    assertEquals(
      response.status,
      201,
      `Failed to create test context. Server response status ${response.status}, body ${JSON.stringify(response.body)}`
    );

    return response.body;
  }
}

/**
 * The arguments to create a test context with.
 */
export type CreateTestContext = {
  launchId?: number;
  parentTestContextId?: number;
  title?: string;
  createdTimestamp?: Date;
  startedTimestamp?: Date;
  finishedTimestamp?: Date;
};
