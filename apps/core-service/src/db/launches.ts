import { launches } from "@total-report/core-schema/schema";
import { eq } from "drizzle-orm";
import { db } from "../db/setup.js";
import { v4 as uuidv4 } from "uuid";
import { ReportNotFoundError } from "../errors/errors.js";

export const createLaunch = async (
  args: CreateLaunchArgs
): Promise<CreatedLaunch> => {
  try {
    return (
      await db
        .insert(launches)
        .values({
          id: uuidv4(),
          title: args.title,
          reportId: args.reportId,
          createdTimestamp: new Date().toISOString(),
        })
        .returning()
    ).at(0)!;
  } catch (error) {
    console.log(typeof error);
    throw new ReportNotFoundError(args.reportId);
  }
};

export const findLaunchById = async (id: string): Promise<CreatedLaunch | undefined> => {
  const found = await db.select().from(launches).where(eq(launches.id, id));
  if (found.length === 0) {
    return undefined;
  }
  return found[0];
};

type CreateLaunchArgs = {
  reportId: string;
  title: string;
};

type CreatedLaunch = {
  id: string;
  title: string;
  createdTimestamp: string;
  startedTimestamp: string | null;
  finishedTimestamp: string | null;
  reportId: string;
};
