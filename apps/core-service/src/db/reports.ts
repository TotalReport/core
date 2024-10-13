import { launches, reports } from "@total-report/core-schema/schema";
import { eq } from "drizzle-orm";
import { db } from "./setup.js";

export const createReport = async ({
  title,
}: CreateReportArgs): Promise<ReportBaseInfo> => {
  return (
    await db
      .insert(reports)
      .values({
        title,
        createdTimestamp: new Date().toISOString(),
      })
      .returning()
  ).at(0)!;
};

export const findReportById = async (
  id: number
): Promise<ReportBaseInfo | undefined> => {
  const found = await db.transaction(async (tx) => {
    return await tx.select().from(reports).where(eq(reports.id, id));
  });

  if (found.length === 0) {
    return undefined;
  }
  return found[0];
};

export const deleteReportById = async (id: number): Promise<void> => {
  await db.transaction(async (tx) => {
    // FIXME: handle launches delete in launches.ts
    await tx.delete(launches).where(eq(launches.reportId, id));
    await tx.delete(reports).where(eq(reports.id, id));
  });
};

type CreateReportArgs = {
  title: string;
};

type ReportBaseInfo = {
  id: number;
  title: string;
  createdTimestamp: string;
};
