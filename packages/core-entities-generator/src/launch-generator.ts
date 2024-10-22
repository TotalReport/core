import { faker } from "@faker-js/faker";
import { ClientType } from "./types.js";
import { assertEquals } from "./utils.js";
import { ReportsGenerator } from "./report-generator.js";

/**
 * This class is responsible for generating launches.
 */
export class LaunchesGenerator {
  client: ClientType;

  constructor(client: ClientType) {
    this.client = client;
  }

  /**
   * Creates a new launch.
   * 
   * @param args The arguments to create the launch with.
   * @returns The created launch.
   */
  async create(
    args: GenerateLaunch | undefined = undefined
  ){
    const reportId = args?.reportId ?? (await new ReportsGenerator(this.client).create()).id;
  
    const title =
      args?.title ??
      faker.word.noun() + " " + faker.word.verb() + " " + faker.date.recent();
  
    const response = await this.client.createLaunch({
      body: {
        reportId: reportId,
        title: title,
        createdTimestamp: args?.createdTimestamp,
        startedTimestamp: args?.startedTimestamp,
        finishedTimestamp: args?.finishedTimestamp,
      },
    });
  
    assertEquals(
      response.status,
      201,
      `Failed to create launch. Server response status ${response.status}, body ${JSON.stringify(response.body)}`
    );
  
    return response.body;
  };
}



type GenerateLaunch = {
  reportId?: number;
  title?: string;
  createdTimestamp?: Date;
  startedTimestamp?: Date;
  finishedTimestamp?: Date;
};
