import { beforeTestSteps } from "@total-report/core-schema/schema";
import { eq } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { db as defaultDB } from "../db/setup.js";
import { BeforeTestStepNotFoundError } from "../errors/errors.js";
import {
  validateTimestampsAndSuccess,
  validateTitle,
} from "../validations/validations.js";

export class BeforeTestStepsDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    this.db = db;
  }

  async create(args: CreateBeforeTestStep): Promise<BeforeTestStepEntity> {
    validate(args);

    const beforeTestStepsRow = (
      await this.db.insert(beforeTestSteps).values(args).returning()
    ).at(0)!;

    return {
      ...beforeTestStepsRow,
      startedTimestamp: beforeTestStepsRow.startedTimestamp ?? undefined,
      finishedTimestamp: beforeTestStepsRow.finishedTimestamp ?? undefined,
      isSuccessful: beforeTestStepsRow.isSuccessful ?? undefined,
      errorMessage: beforeTestStepsRow.errorMessage ?? undefined,
    };
  }

  async findById(id: number): Promise<BeforeTestStepEntity | undefined> {
    const row = await this.db
      .select()
      .from(beforeTestSteps)
      .where(eq(beforeTestSteps.id, id))
      .then((rows) => rows[0]);

    if (row == undefined) {
      return undefined;
    }

    return convertRowToEntity(row);
  }

  async findByBeforeTestId(beforeTestId: string): Promise<BeforeTestStepRow[]> {
    return await this.db
      .select()
      .from(beforeTestSteps)
      .where(eq(beforeTestSteps.beforeTestId, beforeTestId));
  }

  async patch(args: PatchBeforeTestStep): Promise<BeforeTestStepEntity> {
    return await this.db.transaction(async (tx) => {
      const row = await tx
        .select()
        .from(beforeTestSteps)
        .where(eq(beforeTestSteps.id, args.id))
        .then((rows) => rows[0]);

      if (row == undefined) {
        throw new BeforeTestStepNotFoundError(args.id);
      }

      const patch = takeUpdateableFields(args);

      validate(applyPatch({ row, patch }));

      await tx
        .update(beforeTestSteps)
        .set(patch)
        .where(eq(beforeTestSteps.id, args.id));

      return (await new BeforeTestStepsDAO(tx).findById(args.id))!;
    });
  }

  async deleteByBeforeTestId(beforeTestId: string): Promise<void> {
    await this.db
      .delete(beforeTestSteps)
      .where(eq(beforeTestSteps.beforeTestId, beforeTestId));
  }

  async deleteById(id: number): Promise<void> {
    await this.db.delete(beforeTestSteps).where(eq(beforeTestSteps.id, id));
  }
}

export type CreateBeforeTestStep = {
  beforeTestId: string;
  title: string;
  createdTimestamp: Date;
  startedTimestamp?: Date;
  finishedTimestamp?: Date;
  isSuccessful?: boolean;
  errorMessage?: string;
};

export type PatchBeforeTestStep = {
  id: number;
  title?: string;
  createdTimestamp?: Date;
  startedTimestamp?: Date | null;
  finishedTimestamp?: Date | null;
  isSuccessful?: boolean | null;
  errorMessage?: string | null;
};

export type BeforeTestStepEntity = ReplaceNullWithUndefined<BeforeTestStepRow>;

const validate = (args: CreateBeforeTestStep | BeforeTestStepRow) => {
  validateTitle(args);
  validateTimestampsAndSuccess(args);
};

const applyPatch = (args: {
  row: BeforeTestStepRow;
  patch: UpdateableFields;
}): BeforeTestStepRow => {
  return {
    ...args.row,
    ...args.patch,
  };
};

const convertRowToEntity = (row: BeforeTestStepRow): BeforeTestStepEntity => {
  return {
    beforeTestId: row.beforeTestId,
    id: row.id,
    title: row.title,
    createdTimestamp: row.createdTimestamp,
    startedTimestamp: row.startedTimestamp ?? undefined,
    finishedTimestamp: row.finishedTimestamp ?? undefined,
    isSuccessful: row.isSuccessful ?? undefined,
    errorMessage: row.errorMessage ?? undefined,
  };
};

const takeUpdateableFields = (args: PatchBeforeTestStep): UpdateableFields => {
  return {
    title: args.title,
    createdTimestamp: args.createdTimestamp,
    startedTimestamp: args.startedTimestamp,
    finishedTimestamp: args.finishedTimestamp,
    isSuccessful: args.isSuccessful,
    errorMessage: args.errorMessage,
  };
};

type BeforeTestStepRow = typeof beforeTestSteps.$inferSelect;

type UpdateableFields = {
  title?: string;
  createdTimestamp?: Date;
  startedTimestamp?: Date | null;
  finishedTimestamp?: Date | null;
  isSuccessful?: boolean | null;
  errorMessage?: string | null;
};

type ReplaceNullWithUndefined<T extends Object> = {
  [k in keyof T]: null extends T[k] ? Exclude<T[k], null> | undefined : T[k];
};
