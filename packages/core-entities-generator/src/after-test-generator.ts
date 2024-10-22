import { faker } from "@faker-js/faker";
import { LaunchesGenerator } from "./launch-generator.js";
import { ClientType } from "./types.js";
import { assertEquals } from "./utils.js";

/**
 * This class is responsible for generating after tests.
 */
export class AfterTestsGenerator {
  client: ClientType;

  constructor(client: ClientType) {
    this.client = client;
  }

  /**
   * Creates a new after test.
   *
   * @param args The arguments to create the after test with.
   * @returns The created after test.
   */
  async create(args: CreateAfterTestArgs | undefined = undefined) {
    const launchId =
      args?.launchId ?? (await new LaunchesGenerator(this.client).create()).id;
    const title =
      args?.title ??
      faker.word.noun() + " " + faker.word.verb() + " " + faker.date.recent();
    const response = await this.client.createAfterTest({
      body: {
        ...args,
        launchId: launchId,
        title: title,
      },
    });

    assertEquals(
      response.status,
      201,
      `Failed to create after test. Server response status ${response.status}, body ${JSON.stringify(response.body)}`
    );

    return response.body;
  }
}

/**
 * The arguments to create an after test with.
 */
export type CreateAfterTestArgs = {
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
