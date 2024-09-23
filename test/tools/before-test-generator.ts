import { faker } from "@faker-js/faker";
import { contract } from "@total-report/core-contract/contract";
import { initClient, InitClientArgs } from "@ts-rest/core";
import { client } from "./client.js";
import { generateLaunch } from "./launch-generator.js";

export type ClientType = ReturnType<
  typeof initClient<typeof contract, InitClientArgs>
>;

export class BeforeTestsGenerator {
  client: ClientType;

  constructor(client: ClientType) {
    this.client = client;
  }

  async create(args: CreateBeforeTestArgs = undefined) {
    const launchId = args?.launchId ?? (await generateLaunch()).id;
    const title =
      args?.title ??
      faker.word.noun() + " " + faker.word.verb() + " " + faker.date.recent();
    const response = await client.createBeforeTest({
      body: {
        launchId: launchId,
        title: title,
        arguments: args?.arguments ?? [],
      },
    });
    if (response.status !== 201) {
      throw new Error("Failed to create before test. Server response: " + response.body);
    }
    return response.body;
  }
}

type CreateBeforeTestArgs =
  | {
      title?: string;
      launchId?: string;
      arguments?: Array<{
        name: string;
        type: string;
        value: string;
      }>;
    }
  | undefined;
