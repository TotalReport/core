import { faker } from "@faker-js/faker";
import { ClientType } from "./types.js";
import { LaunchesGenerator } from "./launch-generator.js";
import { assertEquals } from "./utils.js";
import { ClientInferRequest, ClientInferResponseBody } from "@ts-rest/core";
import { contract } from "@total-report/core-contract/contract";
import { capitalizeFirstLetter } from "./utils-string.js";

/**
 * This class is responsible for generating tests.
 */
export class TestsGenerator {
  client: ClientType;

  constructor(client: ClientType) {
    this.client = client;
    this.create = this.create.bind(this);
    this.createMultiple = this.createMultiple.bind(this);
  }

  /**
   * Creates a new test.
   *
   * @param args The arguments to create the test with.
   * @returns The created test.
   */
  async create(
    args: GenerateTestArgs | undefined = undefined,
  ): Promise<CreateTestResponse> {
    const launchId =
      args?.launchId ?? (await new LaunchesGenerator(this.client).create()).id;

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
          args.startedTimestamp,
          args.finishedTimestamp,
          now,
        ].find((x) => x !== undefined);
      }
    }

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
      `Failed to create test. Server response status ${response.status}, body ${JSON.stringify(response.body)}`,
    );

    return response.body;
  }

  /**
   * Creates multiple tests.
   *
   * @param count The number of tests to create.
   * @param argsProvider The function that provides the arguments for each test.
   * @returns The created tests.
   */
  async createMultiple(
    count: number,
    argsProvider: (index: number) => GenerateTestArgs | undefined,
  ): Promise<Array<CreateTestResponse>> {
    const result = Array.from({ length: count }).map(
      async (_, i) => await this.create(argsProvider(i)),
    );
    return await Promise.all(result);
  }

  /**
   * Creates a new test by sample.
   *
   * @param params The parameters to create the test run with.
   * @returns The created test.
   */
  async createBySample(params: CreateTestParams) {
    const launchId = params.launch.id;

    return await this.create({
      launchId: launchId,
      title: params.sample.title,
      correlationId: params.sample.correlationId,
      arguments: params.sample.arguments,
      argumentsHash: params.sample.argumentsHash,
      externalArguments: params.sample.externalArguments,
      externalArgumentsHash: params.sample.externalArgumentsHash,
      startedTimestamp: params.startedTimestamp,
      finishedTimestamp: params.finishedTimestamp,
      statusId: params.statusId,
    });
  }
}

type TestToRun = Pick<
  CreateTestResponse,
  | "title"
  | "correlationId"
  | "arguments"
  | "argumentsHash"
  | "externalArguments"
  | "externalArgumentsHash"
>;

type CreateTestParams = {
  sample: TestToRun;
  launch: { id: number };
  startedTimestamp: Date | undefined;
} &
  (NotFinished | Finished);


type NotFinished = {
  finishedTimestamp: undefined;
  statusId: undefined;
};

type Finished = {
  finishedTimestamp: Date;
  statusId: string;
};

/**
 * The arguments to create a test with.
 */
export type GenerateTestArgs = Partial<CreateTestRequest>;

export type CreateTestRequest = ClientInferRequest<
  typeof contract.createTest
>["body"];

export type CreateTestResponse = ClientInferResponseBody<
  typeof contract.createTest,
  201
>;
