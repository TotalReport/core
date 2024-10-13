import { faker } from "@faker-js/faker";
import { contract } from "@total-report/core-contract/contract";
import { initClient, InitClientArgs } from "@ts-rest/core";
import { client } from "./client.js";
import { generateLaunch } from "./launch-generator.js";

export type ClientType = ReturnType<
  typeof initClient<typeof contract, InitClientArgs>
>;

export class AfterTestsGenerator {
  client: ClientType;

  constructor(client: ClientType) {
    this.client = client;
  }

  async create(args: CreateAfterTestArgs | undefined = undefined) {
    const launchId = args?.launchId ?? (await generateLaunch()).id;
    const title =
      args?.title ??
      faker.word.noun() + " " + faker.word.verb() + " " + faker.date.recent();
    const response = await client.createAfterTest({
      body: {
        ...args,
        launchId: launchId,
        title: title,
      },
    });
    if (response.status !== 201) {
      throw new Error(
        `Failed to create after test. Server response status ${response.status} body ${JSON.stringify(response.body)}`
      );
    }
    return response.body;
  }
}

type CreateAfterTestArgs = {
  launchId?: number;
  testContextId?: number;
  createdTimestamp?: Date;
  startedTimestamp?: Date;
  finishedTimestamp?: Date;
  statusId?: string;
  title?: string;
  arguments?: Array<{
    name: string;
    type: string;
    value: string;
  }>;
};
