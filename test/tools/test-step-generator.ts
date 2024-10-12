import { faker } from "@faker-js/faker";
import { contract } from "@total-report/core-contract/contract";
import { initClient, InitClientArgs } from "@ts-rest/core";
import { TestsGenerator } from "./test-generator.js";
import { client } from "./client.js";

export type ClientType = ReturnType<
  typeof initClient<typeof contract, InitClientArgs>
>;

export class TestStepsGenerator {
  client: ClientType;

  constructor(client: ClientType) {
    this.client = client;
  }

  async create(args: CreateTestStepArgs | undefined = undefined) {
    const testId = args?.testId ?? (await new TestsGenerator(client).create()).id;
    
    const title =
      args?.title ??
      faker.word.noun() + " " + faker.word.verb() + " " + faker.date.recent();

    const response = await client.createTestStep({
      body: {
        testId: testId,
        title: title,
        createdTimestamp: args?.createdTimestamp,
        startedTimestamp: args?.startedTimestamp,
        finishedTimestamp: args?.finishedTimestamp,
        isSuccessful: args?.isSuccessful,
        errorMessage: args?.errorMessage
      },
    });
    if (response.status !== 201) {
      throw new Error(
        `Failed to create test step. Server response status ${response.status} body ${JSON.stringify(response.body)}`
      );
    }
    return response.body;
  }
}

type CreateTestStepArgs = {
  testId?: string;
  createdTimestamp?: Date;
  startedTimestamp?: Date;
  finishedTimestamp?: Date;
  title?: string;
  isSuccessful?: boolean;
  errorMessage?: string;
};
