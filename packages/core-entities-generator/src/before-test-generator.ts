import { faker } from "@faker-js/faker";
import { ClientType } from "./types.js";
import { assertEquals } from "./utils.js";
import { LaunchesGenerator } from "./launch-generator.js";
import { ClientInferRequest, ClientInferResponseBody } from "@ts-rest/core";
import { contract } from "@total-report/core-contract/contract";
import { capitalizeFirstLetter } from "./utils-string.js";

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
  async create(args: GenerateBeforeTestArgs | undefined = undefined): Promise<CreateBeforeTestResponse> {
    const launchId =
      args?.launchId ?? (await new LaunchesGenerator(this.client).create()).id;

    const title =
      args?.title ??
      capitalizeFirstLetter(faker.word.adjective() + " " + 
      faker.word.noun() + " " + 
      faker.word.verb() + " " + 
      faker.word.adverb());

    if (args?.statusId !== undefined) {
      const now = new Date();
      if (args.finishedTimestamp === undefined) {
        args.finishedTimestamp = [
          args.startedTimestamp,
          args.createdTimestamp,
          now,
        ].find((x) => x !== undefined);
      }
      if (args.startedTimestamp === undefined) {
        args.startedTimestamp = [
          args.finishedTimestamp,
          args.createdTimestamp,
          now,
        ].find((x) => x !== undefined);
      }
      if (args.createdTimestamp === undefined) {
        args.createdTimestamp = [
          args.createdTimestamp,
          args.finishedTimestamp,
          now,
        ].find((x) => x !== undefined);
      }
    }

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

  /**
   * Creates multiple before tests.
   *
   * @param count The number of before tests to create.
   * @param argsProvider The function that provides the arguments for each befoer test.
   * @returns The created before tests.
   */
  async createMultiple(
    count: number,
    argsProvider: (index: number) => GenerateBeforeTestArgs | undefined
  ): Promise<Array<CreateBeforeTestResponse>> {
    const result = Array.from({ length: count }).map(
      async (_, i) => await this.create(argsProvider(i))
    );
    return await Promise.all(result);
  }
}

/**
 * The arguments to create a before test with.
 */
export type GenerateBeforeTestArgs = Partial<CreateBeforeTestRequest>;

export type CreateBeforeTestRequest = ClientInferRequest<
  typeof contract.createTest
>["body"];

export type CreateBeforeTestResponse = ClientInferResponseBody<
  typeof contract.createBeforeTest,
  201
>;
