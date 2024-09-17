import { launches } from "@total-report/core-schema/schema";
import { eq } from "drizzle-orm";
import { db } from "../db/setup.js";
import { v4 as uuidv4 } from "uuid";
import { ReportNotFoundError } from "../errors/errors.js";

export const createLaunch = async (
  args: CreateLaunchArgs
): Promise<LaunchCommonInfo> => {
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

export const findLaunchById = async (
  id: string
): Promise<LaunchCommonInfo | undefined> => {
  const found = await db.select().from(launches).where(eq(launches.id, id));
  if (found.length === 0) {
    return undefined;
  }
  return found[0];
};

export const deleteLaunchById = async (id: string): Promise<void> => {
  await db.delete(launches).where(eq(launches.id, id));
};

export const updateLaunchStarted = async ({
  id,
  startedTimestamp,
}: UpdateLaunchStartedArgs): Promise<LaunchCommonInfo | undefined> => {
  if (startedTimestamp === undefined) {
    await db
      .update(launches)
      .set({ startedTimestamp: new Date().toISOString() })
      .where(eq(launches.id, id));
  } else if (startedTimestamp === null) {
    await db
      .update(launches)
      .set({ startedTimestamp: null })
      .where(eq(launches.id, id));
  } else {
    await db
      .update(launches)
      .set({ startedTimestamp: startedTimestamp.toISOString() })
      .where(eq(launches.id, id));
  }
  return await findLaunchById(id);
};

export const updateLaunchFinished = async ({
  id,
  finishedTimestamp,
}: UpdateLaunchFinishedArgs): Promise<LaunchCommonInfo | undefined> => {
  if (finishedTimestamp === undefined) {
    await db
      .update(launches)
      .set({ finishedTimestamp: new Date().toISOString() })
      .where(eq(launches.id, id));
  } else if (finishedTimestamp === null) {
    await db
      .update(launches)
      .set({ finishedTimestamp: null })
      .where(eq(launches.id, id));
  } else {
    await db
      .update(launches)
      .set({ finishedTimestamp: finishedTimestamp.toISOString() })
      .where(eq(launches.id, id));
  }
  return await findLaunchById(id);
};

type CreateLaunchArgs = {
  reportId: string;
  title: string;
};

type UpdateLaunchStartedArgs = {
  id: string;
  startedTimestamp: Date | null | undefined;
};

type UpdateLaunchFinishedArgs = {
  id: string;
  finishedTimestamp: Date | null | undefined;
};

type LaunchCommonInfo = {
  id: string;
  title: string;
  createdTimestamp: string;
  startedTimestamp: string | null;
  finishedTimestamp: string | null;
  reportId: string;
};
