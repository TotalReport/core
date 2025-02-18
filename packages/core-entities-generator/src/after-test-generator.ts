import { faker } from "@faker-js/faker";
import { LaunchesGenerator } from "./launch-generator.js";
import { ClientType } from "./types.js";
import { assertEquals } from "./utils.js";
import { ClientInferRequest, ClientInferResponseBody } from "@ts-rest/core";
import { contract } from "@total-report/core-contract/contract";

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
  async create(
    args: GenerateAfterTestArgs | undefined = undefined
  ): Promise<CreateAfterTestResponse> {
    const launchId =
      args?.launchId ?? (await new LaunchesGenerator(this.client).create()).id;
    const title =
      args?.title ??
      faker.word.noun() + " " + faker.word.verb() + " " + faker.date.recent();

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

  /**
   * Creates multiple before tests.
   *
   * @param count The number of before tests to create.
   * @param argsProvider The function that provides the arguments for each befoer test.
   * @returns The created before tests.
   */
  async createMultiple(
    count: number,
    argsProvider: (index: number) => GenerateAfterTestArgs | undefined
  ): Promise<Array<CreateAfterTestResponse>> {
    const result = Array.from({ length: count }).map(
      async (_, i) => await this.create(argsProvider(i))
    );
    return await Promise.all(result);
  }
}

/**
 * The arguments to create an after test with.
 */
export type GenerateAfterTestArgs = Partial<CreateAfterTestRequest>;

export type CreateAfterTestRequest = ClientInferRequest<
  typeof contract.createTest
>["body"];

export type CreateAfterTestResponse = ClientInferResponseBody<
  typeof contract.createAfterTest,
  201
>;
