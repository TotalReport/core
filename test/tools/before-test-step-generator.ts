import { faker } from "@faker-js/faker";
import { contract } from "@total-report/core-contract/contract";
import { initClient, InitClientArgs } from "@ts-rest/core";
import { BeforeTestsGenerator } from "./before-test-generator.js";
import { client } from "./client.js";

export type ClientType = ReturnType<
  typeof initClient<typeof contract, InitClientArgs>
>;

export class BeforeTestStepsGenerator {
  client: ClientType;

  constructor(client: ClientType) {
    this.client = client;
  }

  async create(args: CreateBeforeTestStepArgs | undefined = undefined) {
    const beforeTestId = args?.beforeTestId ?? (await new BeforeTestsGenerator(client).create()).id;
    
    const title =
      args?.title ??
      faker.word.noun() + " " + faker.word.verb() + " " + faker.date.recent();

    const response = await client.createBeforeTestStep({
      body: {
        beforeTestId: beforeTestId,
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
        `Failed to create before test step. Server response status ${response.status} body ${JSON.stringify(response.body)}`
      );
    }
    return response.body;
  }
}

type CreateBeforeTestStepArgs = {
  beforeTestId?: string;
  createdTimestamp?: Date;
  startedTimestamp?: Date;
  finishedTimestamp?: Date;
  title?: string;
  isSuccessful?: boolean;
  errorMessage?: string;
};
