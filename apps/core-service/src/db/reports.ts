import { reports } from "@total-report/core-schema/schema";
import { db } from "./setup.js";
import { v4 as uuidv4 } from "uuid";

export const createReport = async ({
  title,
}: CreateReportArgs): Promise<CreatedReport> => {
  return (
    await db
      .insert(reports)
      .values({
        id: uuidv4(),
        title,
        createdTimestamp: new Date().toISOString(),
      })
      .returning()
  ).at(0)!;
};

type CreateReportArgs = {
  title: string;
};

type CreatedReport = {
  id: string;
  title: string;
  createdTimestamp: string;
};
