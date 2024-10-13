import { faker } from "@faker-js/faker";
import { contract } from "@total-report/core-contract/contract";
import { initClient, InitClientArgs } from "@ts-rest/core";
import { client } from "./client.js";
import { generateLaunch } from "./launch-generator.js";

export type ClientType = ReturnType<
  typeof initClient<typeof contract, InitClientArgs>
>;

export class TestContextsGenerator {
  client: ClientType;

  constructor(client: ClientType) {
    this.client = client;
  }

  async create(args: CreateTestContext | undefined = undefined) {
    const launchId = args?.launchId ?? (await generateLaunch()).id;

    const title =
      args?.title ??
      faker.word.noun() + " " + faker.word.verb() + " " + faker.date.recent();

    const response = await client.createTestContext({
      body: {
        parentTestContextId: args?.parentTestContextId,
        launchId: launchId,
        title: title,
        createdTimestamp: args?.createdTimestamp,
        startedTimestamp: args?.startedTimestamp,
        finishedTimestamp: args?.finishedTimestamp,
      },
    });
    if (response.status !== 201) {
      throw new Error(
        "Failed to create after test. Server response: " + response.body
      );
    }
    return response.body;
  }
}

type CreateTestContext = {
  launchId?: number;
  parentTestContextId?: number;
  title?: string;
  createdTimestamp?: Date;
  startedTimestamp?: Date;
  finishedTimestamp?: Date;
};
