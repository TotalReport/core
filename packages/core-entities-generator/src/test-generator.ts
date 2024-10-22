import { faker } from "@faker-js/faker";
import { ClientType } from "./types.js";
import { LaunchesGenerator } from "./launch-generator.js";
import { assertEquals } from "./utils.js";

/**
 * This class is responsible for generating tests.
 */
export class TestsGenerator {
  client: ClientType;

  constructor(client: ClientType) {
    this.client = client;
  }

  /**
   * Creates a new test.
   * 
   * @param args The arguments to create the test with.
   * @returns The created test.
   */
  async create(args: CreateTestArgs | undefined = undefined) {
    const launchId = args?.launchId ?? (await new LaunchesGenerator(this.client).create()).id;

    const title =
      args?.title ??
      faker.word.noun() + " " + faker.word.verb() + " " + faker.date.recent();

    const response = await this.client.createTest({
      body: {
        ...args,
        launchId: launchId,
        title: title,
      },
    });

    assertEquals(
      response.status,
      201,
      `Failed to create test. Server response status ${response.status}, body ${JSON.stringify(response.body)}`
    )

    return response.body;
  }
}

/**
 * The arguments to create a test with.
 */
export type CreateTestArgs = {
  launchId?: number;
  testContextId?: number;
  createdTimestamp?: Date;
  startedTimestamp?: Date;
  finishedTimestamp?: Date;
  statusId?: string;
  title?: string;
  arguments?: Array<{
    name: string;
    type: string;
    value: string;
  }>;
};
