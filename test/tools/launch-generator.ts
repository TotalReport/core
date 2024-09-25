import { faker } from "@faker-js/faker";
import { client } from "./client.js";
import { expect_toBe } from "./utils.js";
import { generateReport } from "./report-generator.js";

export const generateLaunch = async (
  args: GenerateLaunch | undefined = undefined
) => {
  const reportId = args?.reportId ?? (await generateReport()).id;

  const title =
    args?.title ??
    faker.word.noun() + " " + faker.word.verb() + " " + faker.date.recent();

  const response = await client.createLaunch({
    body: {
      reportId: reportId,
      title: title,
      createdTimestamp: args?.createdTimestamp,
      startedTimestamp: args?.startedTimestamp,
      finishedTimestamp: args?.finishedTimestamp,
    },
  });

  expect_toBe(response.status, 201);

  return response.body;
};

type GenerateLaunch = {
  title?: string;
  reportId?: string;
  createdTimestamp?: Date;
  startedTimestamp?: Date;
  finishedTimestamp?: Date;
};
