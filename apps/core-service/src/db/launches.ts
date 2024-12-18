import { launches } from "@total-report/core-schema/schema";
import { eq } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { ReportNotFoundError } from "../errors/errors.js";
import { validateTimestamps } from "../validations/validations.js";
import { db as defaultDB } from "./setup.js";

export class LaunchesDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    this.db = db;
  }

  async create(args: CreateLaunch): Promise<LaunchEntity> {
    try {
      validateLaunch(args);

      const found = await this.db
        .insert(launches)
        .values({
          title: args.title,
          reportId: args.reportId,
          createdTimestamp: args.createdTimestamp,
          startedTimestamp: args.startedTimestamp,
          finishedTimestamp: args.finishedTimestamp,
        })
        .returning();

      return convertToEntity(found[0]!);
    } catch (error) {
      console.log("ERROR TYPE", typeof error);
      console.log("ERROR", error);
      throw new ReportNotFoundError(args.reportId);
    }
  }

  async findById(id: number): Promise<LaunchEntity | undefined> {
    const found = await this.db
      .select()
      .from(launches)
      .where(eq(launches.id, id));
    if (found.length === 0) {
      return undefined;
    }
    return convertToEntity(found[0]!);
  }

  async patch(args: PatchLaunch): Promise<LaunchEntity> {
    const result = await this.db.transaction(async (tx) => {
      const launchFromDb = await new LaunchesDAO(tx).findById(args.id);

      if (launchFromDb === undefined) {
        throw new Error(`Launch with id ${args.id} not found`);
      }

      let update: SetColumnsValues = convertToSetColumns(args);

      const expectedRow = {
        ...launchFromDb,
        ...update,
      };

      validateLaunch(expectedRow);

      await tx.update(launches).set(update).where(eq(launches.id, args.id));

      return (await new LaunchesDAO(tx).findById(args.id))!;
    });

    return result;
  }

  async deleteById(id: number): Promise<void> {
    await this.db.delete(launches).where(eq(launches.id, id));
  }
}

const validateLaunch = (args: {
  title: string;
  createdTimestamp: Date;
  startedTimestamp?: Date | null;
  finishedTimestamp?: Date | null;
}) => {
  if (args.title.length === 0) {
    throw new Error("Title should not be empty.");
  }

  validateTimestamps(args);
};

type CreateLaunch = {
  reportId: number;
  title: string;
  createdTimestamp: Date;
  startedTimestamp?: Date;
  finishedTimestamp?: Date;
};

type PatchLaunch = {
  id: number;
  title?: string;
  createdTimestamp?: Date;
  startedTimestamp?: Date | null;
  finishedTimestamp?: Date | null;
};

type SetColumnsValues = {
  title?: string;
  createdTimestamp?: Date;
  startedTimestamp?: Date | null;
  finishedTimestamp?: Date | null;
};

type LaunchRow = {
  reportId: number;
  id: number;
  title: string;
  createdTimestamp: Date;
  startedTimestamp: Date | null;
  finishedTimestamp: Date | null;
};

type LaunchEntity = {
  reportId: number;
  id: number;
  title: string;
  createdTimestamp: Date;
  startedTimestamp?: Date;
  finishedTimestamp?: Date;
};

const convertToEntity = (row: LaunchRow): LaunchEntity => {
  return {
    reportId: row.reportId,
    id: row.id,
    title: row.title,
    createdTimestamp: row.createdTimestamp,
    startedTimestamp: row.startedTimestamp ? row.startedTimestamp : undefined,
    finishedTimestamp: row.finishedTimestamp
      ? row.finishedTimestamp
      : undefined,
  };
};

const convertToSetColumns = (args: PatchLaunch) => {
  let update: SetColumnsValues = {};
  if (args.title !== undefined) {
    update = { ...update, title: args.title };
  }

  if (args.createdTimestamp !== undefined) {
    update = {
      ...update,
      createdTimestamp: args.createdTimestamp,
    };
  }

  if (args.startedTimestamp !== undefined) {
    if (args.startedTimestamp === null) {
      update = { ...update, startedTimestamp: null };
    } else {
      update = {
        ...update,
        startedTimestamp: args.startedTimestamp,
      };
    }
  }

  if (args.finishedTimestamp !== undefined) {
    if (args.finishedTimestamp === null) {
      update = { ...update, finishedTimestamp: null };
    } else {
      update = {
        ...update,
        finishedTimestamp: args.finishedTimestamp,
      };
    }
  }
  return update;
};
