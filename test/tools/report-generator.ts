import { faker } from "@faker-js/faker";
import { client } from "./client.js";
import { expect_toBe } from "./utils.js";

export const generateReport = async (args: CreateReportArgs | undefined = undefined) => {
  const title =
    args?.title ??
    faker.word.noun() + " " + faker.word.verb() + " " + faker.word.adjective();

  const response = await client.createReport({
    body: {
      title: title,
    },
  });

  expect_toBe(response.status, 201);

  return response.body;
};

type CreateReportArgs = {
  title: string | null;
};
