import { faker } from "@faker-js/faker";
import { ClientType } from "./types.js";
import { LaunchesGenerator } from "./launch-generator.js";
import { assertEquals, firstDefined } from "./utils.js";
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
   * Creates a new before test with default values.
   *
   * @param args The arguments to create the before test with.
   * @return The created before test.
   */
  async createBeforeTest(
    args: GenerateTestArgs | undefined,
  ): Promise<CreateTestResponse> {
    return await this.create({
      ...args,
      entityType: "beforeTest",
    });
  }

  /**
   * Creates a new test with default values.
   *
   * @param args The arguments to create the test with.
   * @return The created test.
   */
  async createTest(
    args: GenerateTestArgs | undefined,
  ): Promise<CreateTestResponse> {
    return await this.create({
      ...args,
      entityType: "test",
    });
  }

  /**
   * Creates a new after test with default values.
   *
   * @param args The arguments to create the after test with.
   * @return The created after test.
   */
  async createAfterTest(
    args: GenerateTestArgs | undefined,
  ): Promise<CreateTestResponse> {
    return await this.create({
      ...args,
      entityType: "afterTest",
    });
  }

  /**
   * Creates a new test.
   *
   * @param args The arguments to create the test with.
   * @returns The created test.
   */
  async create(args: GenerateTestEntityArgs): Promise<CreateTestResponse> {
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

    const now = new Date();

    const response = await this.client.createTest({
      body: {
        ...args,
        startedTimestamp: firstDefined(
          args?.startedTimestamp,
          args?.finishedTimestamp,
          now,
        ),
        finishedTimestamp:
          args?.statusId === undefined
            ? args?.finishedTimestamp
            : firstDefined(
                args?.finishedTimestamp,
                args?.startedTimestamp,
                now,
              ),
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
   * Creates multiple before tests.
   *
   * @param count The number of before tests to create.
   * @param argsProvider The function that provides the arguments for each before test.
   * @returns The created before tests.
   */
  async createMultipleBeforeTests(
    count: number,
    argsProvider: (index: number) => GenerateTestArgs | undefined,
  ): Promise<Array<CreateTestResponse>> {
    const result = Array.from({ length: count }).map(
      async (_, i) => await this.createBeforeTest(argsProvider(i)),
    );
    return await Promise.all(result);
  }

  /**
   * Creates multiple tests.
   *
   * @param count The number of tests to create.
   * @param argsProvider The function that provides the arguments for each test.
   * @returns The created tests.
   */
  async createMultipleTests(
    count: number,
    argsProvider: (index: number) => GenerateTestArgs,
  ): Promise<Array<CreateTestResponse>> {
    const result = Array.from({ length: count }).map(
      async (_, i) => await this.createTest(argsProvider(i)),
    );
    return await Promise.all(result);
  }

  /**
   * Creates multiple after tests.
   * 
   * @param count The number of after tests to create.
   * @param argsProvider The function that provides the arguments for each after test.
   * @returns The created after tests.
   */
  async createMultipleAfterTests(
    count: number,
    argsProvider: (index: number) => GenerateTestArgs | undefined,
  ): Promise<Array<CreateTestResponse>> {
    const result = Array.from({ length: count }).map(
      async (_, i) => await this.createAfterTest(argsProvider(i)),
    );
    return await Promise.all(result);
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
    argsProvider: (index: number) => GenerateTestEntityArgs,
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
      entityType: params.sample.entityType,
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

type Sample = Pick<
  CreateTestResponse,
  | "entityType"
  | "title"
  | "correlationId"
  | "arguments"
  | "argumentsHash"
  | "externalArguments"
  | "externalArgumentsHash"
>;

type CreateTestParams = {
  sample: Sample;
  launch: { id: number };
  startedTimestamp: Date | undefined;
} & (NotFinished | Finished);

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
export type GenerateTestEntityArgs = Partial<CreateTestRequest> &
  Pick<CreateTestRequest, "entityType">;

export type GenerateTestArgs = Omit<Partial<CreateTestRequest>, "entityType">;

export type CreateTestRequest = ClientInferRequest<
  typeof contract.createTest
>["body"];

export type CreateTestResponse = ClientInferResponseBody<
  typeof contract.createTest,
  201
>;
