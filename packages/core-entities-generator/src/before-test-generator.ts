import { faker } from "@faker-js/faker";
import { ClientType } from "./types.js";
import { assertEquals } from "./utils.js";
import { LaunchesGenerator } from "./launch-generator.js";

/**
 * This class is responsible for generating before tests.
 */
export class BeforeTestsGenerator {
  client: ClientType;

  constructor(client: ClientType) {
    this.client = client;
  }

  /**
   * Creates a new before test.
   * @param args The arguments to create the before test with.
   * @returns The created before test.
   */
  async create(args: CreateBeforeTestArgs | undefined = undefined) {
    const launchId = args?.launchId ?? (await new LaunchesGenerator(this.client).create()).id;
    const title =
      args?.title ??
      faker.word.noun() + " " + faker.word.verb() + " " + faker.date.recent();
    const response = await this.client.createBeforeTest({
      body: {
        ...args,
        launchId: launchId,
        title: title,
      },
    });
    
    assertEquals(
      response.status,
      201,
      `Failed to create before test. Server response status ${response.status}, body ${JSON.stringify(response.body)}`
    );

    return response.body;
  }
}

/**
 * The arguments to create a before test with.
 */
export type CreateBeforeTestArgs = {
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
