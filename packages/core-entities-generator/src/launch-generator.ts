import { faker } from "@faker-js/faker";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferRequest, ClientInferResponseBody } from "@ts-rest/core";
import { ClientType } from "./types.js";
import { capitalizeFirstLetter } from "./utils-string.js";
import { assertEquals, firstDefined } from "./utils.js";

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
    args: GenerateLaunch | undefined = undefined,
  ): Promise<CreateLaunchResponse> {
    const title =
      args?.title ??
      capitalizeFirstLetter(
        faker.word.adjective() +
          " " +
          faker.word.noun() +
          " " +
          faker.word.verb() +
          " " +
          faker.word.adverb(),
      );

    const response = await this.client.createLaunch({
      body: {
        title: title,
        startedTimestamp: firstDefined(
          args?.startedTimestamp,
          args?.finishedTimestamp,
          new Date(),
        ),
        finishedTimestamp: args?.finishedTimestamp,
        arguments: args?.arguments,
      },
    });

    assertEquals(
      response.status,
      201,
      `Failed to create launch. Server response status ${response.status}, body ${JSON.stringify(response.body)}`,
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
  createMany(
    count: number,
    args?: GenerateLaunch,
  ): Promise<CreateLaunchResponse[]> {
    return Promise.all(
      Array.from({ length: count }).map(() => this.create(args)),
    );
  }

  /**
   * Deletes all launches.
   */
  async deleteAll(): Promise<void> {
    const response = await this.client.findLaunches({
      query: { limit: 1000000, offset: 0 },
    });
    if (response.status !== 200) {
      throw new Error(
        `Failed to find launches for deletion. Server response status ${response.status}, body ${JSON.stringify(response.body)}`,
      );
    }

    for (const launch of response.body.items) {
      await this.client.deleteLaunch({ params: { id: launch.id } });
    }
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
