import { afterTestSteps } from "@total-report/core-schema/schema";
import { eq } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { db as defaultDB } from "../db/setup.js";
import { AfterTestStepNotFoundError } from "../errors/errors.js";
import {
  validateTimestampsAndSuccess,
  validateTitle,
} from "../validations/validations.js";

export class AfterTestStepsDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    this.db = db;
  }

  /**
   * Creates a after test step.
   *
   * @param args The fields of the after test step to create.
   * @returns The created after test step.
   */
  async create(args: CreateAfterTestStep): Promise<AfterTestStepEntity> {
    validate(args);

    const afterTestStepsRow = (
      await this.db.insert(afterTestSteps).values(args).returning()
    ).at(0)!;

    return {
      ...afterTestStepsRow,
      startedTimestamp: afterTestStepsRow.startedTimestamp ?? undefined,
      finishedTimestamp: afterTestStepsRow.finishedTimestamp ?? undefined,
      isSuccessful: afterTestStepsRow.isSuccessful ?? undefined,
      errorMessage: afterTestStepsRow.errorMessage ?? undefined,
    };
  }

  /**
   * Finds a after test step by its ID.
   *
   * @param id The ID of the after test step to find.
   * @returns The after test step.
   */
  async findById(id: number): Promise<AfterTestStepEntity | undefined> {
    const row = await this.db
      .select()
      .from(afterTestSteps)
      .where(eq(afterTestSteps.id, id))
      .then((rows) => rows[0]);

    if (row == undefined) {
      return undefined;
    }

    return convertRowToEntity(row);
  }

  /**
   * Finds all after test steps for a after test.
   *
   * @param afterTestId The ID of the after test to find steps for.
   * @returns The after test steps.
   */
  async findByAfterTestId(afterTestId: string): Promise<AfterTestStepRow[]> {
    return await this.db
      .select()
      .from(afterTestSteps)
      .where(eq(afterTestSteps.afterTestId, afterTestId));
  }

  /**
   * Updates a after test step.
   *
   * @param args The fields to update.
   * @returns The updated after test step.
   */
  async patch(args: PatchAfterTestStep): Promise<AfterTestStepEntity> {
    return await this.db.transaction(async (tx) => {
      const row = await tx
        .select()
        .from(afterTestSteps)
        .where(eq(afterTestSteps.id, args.id))
        .then((rows) => rows[0]);

      if (row == undefined) {
        throw new AfterTestStepNotFoundError(args.id);
      }

      const patch = takeUpdateableFields(args);

      validate(applyPatch({ row, patch }));

      await tx
        .update(afterTestSteps)
        .set(patch)
        .where(eq(afterTestSteps.id, args.id));

      return (await new AfterTestStepsDAO(tx).findById(args.id))!;
    });
  }

  /**
   * Deletes all after test steps for a after test.
   *
   * @param afterTestId The ID of the after test to delete steps for.
   */
  async deleteByAfterTestId(afterTestId: string): Promise<void> {
    await this.db
      .delete(afterTestSteps)
      .where(eq(afterTestSteps.afterTestId, afterTestId));
  }

  /**
   * Deletes a after test step by its ID.
   *
   * @param id The ID of the after test step to delete.
   */
  async deleteById(id: number): Promise<void> {
    await this.db.delete(afterTestSteps).where(eq(afterTestSteps.id, id));
  }
}

export type CreateAfterTestStep = {
  afterTestId: string;
  title: string;
  createdTimestamp: Date;
  startedTimestamp: Date | undefined;
  finishedTimestamp: Date | undefined;
  isSuccessful: boolean | undefined;
  errorMessage: string | undefined;
};

export type PatchAfterTestStep = {
  id: number;
  title: string | undefined;
  createdTimestamp: Date | undefined;
  startedTimestamp: Date | null | undefined;
  finishedTimestamp: Date | null | undefined;
  isSuccessful: boolean | null | undefined;
  errorMessage: string | null | undefined;
};

export type AfterTestStepEntity = ReplaceNullWithUndefined<AfterTestStepRow>;

const validate = (args: CreateAfterTestStep | AfterTestStepRow) => {
  validateTitle(args);
  validateTimestampsAndSuccess(args);
};

const applyPatch = (args: {
  row: AfterTestStepRow;
  patch: UpdateableFields;
}): AfterTestStepRow => {
  return {
    id: args.row.id,
    afterTestId: args.row.afterTestId,
    title: firstNotUndefined(args.patch.title, args.row.title),
    createdTimestamp: firstNotUndefined(
      args.patch.createdTimestamp,
      args.row.createdTimestamp
    ),
    startedTimestamp: firstNotUndefined(
      args.patch.startedTimestamp,
      args.row.startedTimestamp
    ),
    finishedTimestamp: firstNotUndefined(
      args.patch.finishedTimestamp,
      args.row.finishedTimestamp
    ),
    isSuccessful: firstNotUndefined(
      args.patch.isSuccessful,
      args.row.isSuccessful
    ),
    errorMessage: firstNotUndefined(
      args.patch.errorMessage,
      args.row.errorMessage
    ),
  };
};

const firstNotUndefined = <T>(
  arg1: NonUndefined<T> | undefined,
  arg2: NonUndefined<T>
): NonUndefined<T> => {
  return arg1 === undefined ? arg2 : arg1;
};

type NonUndefined<T> = T extends undefined ? never : T;

const convertRowToEntity = (row: AfterTestStepRow): AfterTestStepEntity => {
  return {
    afterTestId: row.afterTestId,
    id: row.id,
    title: row.title,
    createdTimestamp: row.createdTimestamp,
    startedTimestamp: nullToUndefined(row.startedTimestamp),
    finishedTimestamp: nullToUndefined(row.finishedTimestamp),
    isSuccessful: nullToUndefined(row.isSuccessful),
    errorMessage: nullToUndefined(row.errorMessage),
  };
};

const nullToUndefined = <T>(
  value: NonNullable<T> | null
): NonNullable<T> | undefined => {
  return value === null ? undefined : value;
};

const takeUpdateableFields = (args: PatchAfterTestStep): UpdateableFields => {
  return {
    title: args.title,
    createdTimestamp: args.createdTimestamp,
    startedTimestamp: args.startedTimestamp,
    finishedTimestamp: args.finishedTimestamp,
    isSuccessful: args.isSuccessful,
    errorMessage: args.errorMessage,
  };
};

type AfterTestStepRow = typeof afterTestSteps.$inferSelect;

type UpdateableFields = {
  title: string | undefined;
  createdTimestamp: Date | undefined;
  startedTimestamp: Date | null | undefined;
  finishedTimestamp: Date | null | undefined;
  isSuccessful: boolean | null | undefined;
  errorMessage: string | null | undefined;
};

type ReplaceNullWithUndefined<T extends Object> = {
  [k in keyof T]: null extends T[k] ? Exclude<T[k], null> | undefined : T[k];
};
