import { reports } from "@total-report/core-schema/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "./setup.js";

export const createReport = async ({
  title,
}: CreateReportArgs): Promise<ReportBaseInfo> => {
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

export const findReportById = async (
  id: string
): Promise<ReportBaseInfo | undefined> => {
  const found = await db.select().from(reports).where(eq(reports.id, id));
  if (found.length === 0) {
    return undefined;
  }
  return found[0];
};

type CreateReportArgs = {
  title: string;
};

type ReportBaseInfo = {
  id: string;
  title: string;
  createdTimestamp: string;
};
