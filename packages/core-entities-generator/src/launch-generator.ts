import { faker } from "@faker-js/faker";
import { ClientType } from "./types.js";
import { assertEquals } from "./utils.js";
import { ReportsGenerator } from "./report-generator.js";
import { ClientInferRequest, ClientInferResponseBody } from "@ts-rest/core";
import { contract } from "@total-report/core-contract/contract";
import { capitalizeFirstLetter } from "./utils-string.js";

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
  ): Promise<CreateLaunchResponse> {
    const reportId =
      args?.reportId ?? (await new ReportsGenerator(this.client).create()).id;

    const title =
      args?.title ??
      capitalizeFirstLetter(faker.word.adjective() + " " + 
      faker.word.noun() + " " + 
      faker.word.verb() + " " + 
      faker.word.adverb());

    const response = await this.client.createLaunch({
      body: {
        reportId: reportId,
        title: title,
        createdTimestamp: args?.createdTimestamp,
        startedTimestamp: args?.startedTimestamp,
        finishedTimestamp: args?.finishedTimestamp,
        arguments: args?.arguments,
        correlationId: args?.correlationId,
        argumentsHash: args?.argumentsHash,
      },
    });

    assertEquals(
      response.status,
      201,
      `Failed to create launch. Server response status ${response.status}, body ${JSON.stringify(response.body)}`
    );

    return response.body;
  }

  /**
   * Creates multiple launches.
   * 
   * @param count The number of launches to create.
   * @param args The arguments to create the launches with.
   * @returns The created launches.
   */
  createMany(count: number, args?: GenerateLaunch): Promise<CreateLaunchResponse[]> {
    return Promise.all(Array.from({ length: count }).map(() => this.create(args)));
  }
}

export type GenerateLaunch = Partial<CreateLaunchRequest>;

export type CreateLaunchRequest = ClientInferRequest<
  typeof contract.createLaunch
>["body"];

export type CreateLaunchResponse = ClientInferResponseBody<
  typeof contract.createLaunch,
  201
>;
