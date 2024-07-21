import { faker } from "@faker-js/faker";
import { client } from "./client.js";
import { expect_toBe } from "./utils.js";
import { generateReport } from "./report-generator.js";

export const generateLaunch = async (args: CreateLaunchArgs = undefined) => {
  const reportId = await getReportId(args);

  const title =
    args?.title ?? faker.word.noun() + faker.word.verb() + faker.date.recent();

  const response = await client.createLaunch({
    body: {
      title: title,
      reportId: reportId,
    },
  });

  expect_toBe(response.status, 201);

  return response.body;
};

const getReportId = async (args: CreateLaunchArgs) => {
  if (args?.reportId == null) {
    return (await generateReport()).id;
  }
  return args.reportId;
};

type CreateLaunchArgs =
  | {
      title: string | null;
      reportId: string | null;
    }
  | undefined;
