import { testSteps } from "@total-report/core-schema/schema";
import { eq } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { db as defaultDB } from "../db/setup.js";
import { TestStepNotFoundError } from "../errors/errors.js";
import {
  validateTimestampsAndSuccess,
  validateTitle,
} from "../validations/validations.js";

export class TestStepsDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    this.db = db;
  }

  /**
   * Creates a test step.
   *
   * @param args The fields of the test step to create.
   * @returns The created test step.
   */
  async create(args: CreateTestStep): Promise<TestStepEntity> {
    validate(args);

    const testStepsRow = (
      await this.db.insert(testSteps).values(args).returning()
    ).at(0)!;

    return {
      ...testStepsRow,
      startedTimestamp: testStepsRow.startedTimestamp ?? undefined,
      finishedTimestamp: testStepsRow.finishedTimestamp ?? undefined,
      isSuccessful: testStepsRow.isSuccessful ?? undefined,
      errorMessage: testStepsRow.errorMessage ?? undefined,
    };
  }

  /**
   * Finds a test step by its ID.
   *
   * @param id The ID of the test step to find.
   * @returns The test step.
   */
  async findById(id: number): Promise<TestStepEntity | undefined> {
    const row = await this.db
      .select()
      .from(testSteps)
      .where(eq(testSteps.id, id))
      .then((rows) => rows[0]);

    if (row == undefined) {
      return undefined;
    }

    return convertRowToEntity(row);
  }

  /**
   * Finds all test steps for a test.
   *
   * @param testId The ID of the test to find steps for.
   * @returns The test steps.
   */
  async findByTestId(testId: string): Promise<TestStepRow[]> {
    return await this.db
      .select()
      .from(testSteps)
      .where(eq(testSteps.testId, testId));
  }

  /**
   * Updates a test step.
   *
   * @param args The fields to update.
   * @returns The updated test step.
   */
  async patch(args: PatchTestStep): Promise<TestStepEntity> {
    return await this.db.transaction(async (tx) => {
      const row = await tx
        .select()
        .from(testSteps)
        .where(eq(testSteps.id, args.id))
        .then((rows) => rows[0]);

      if (row == undefined) {
        throw new TestStepNotFoundError(args.id);
      }

      const patch = takeUpdateableFields(args);

      validate(applyPatch({ row, patch }));

      await tx
        .update(testSteps)
        .set(patch)
        .where(eq(testSteps.id, args.id));

      return (await new TestStepsDAO(tx).findById(args.id))!;
    });
  }

  /**
   * Deletes all test steps for a test.
   *
   * @param testId The ID of the test to delete steps for.
   */
  async deleteByTestId(testId: string): Promise<void> {
    await this.db
      .delete(testSteps)
      .where(eq(testSteps.testId, testId));
  }

  /**
   * Deletes a test step by its ID.
   *
   * @param id The ID of the test step to delete.
   */
  async deleteById(id: number): Promise<void> {
    await this.db.delete(testSteps).where(eq(testSteps.id, id));
  }
}

export type CreateTestStep = {
  testId: string;
  title: string;
  createdTimestamp: Date;
  startedTimestamp: Date | undefined;
  finishedTimestamp: Date | undefined;
  isSuccessful: boolean | undefined;
  errorMessage: string | undefined;
};

export type PatchTestStep = {
  id: number;
  title: string | undefined;
  createdTimestamp: Date | undefined;
  startedTimestamp: Date | null | undefined;
  finishedTimestamp: Date | null | undefined;
  isSuccessful: boolean | null | undefined;
  errorMessage: string | null | undefined;
};

export type TestStepEntity = ReplaceNullWithUndefined<TestStepRow>;

const validate = (args: CreateTestStep | TestStepRow) => {
  validateTitle(args);
  validateTimestampsAndSuccess(args);
};

const applyPatch = (args: {
  row: TestStepRow;
  patch: UpdateableFields;
}): TestStepRow => {
  return {
    id: args.row.id,
    testId: args.row.testId,
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

const convertRowToEntity = (row: TestStepRow): TestStepEntity => {
  return {
    testId: row.testId,
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

const takeUpdateableFields = (args: PatchTestStep): UpdateableFields => {
  return {
    title: args.title,
    createdTimestamp: args.createdTimestamp,
    startedTimestamp: args.startedTimestamp,
    finishedTimestamp: args.finishedTimestamp,
    isSuccessful: args.isSuccessful,
    errorMessage: args.errorMessage,
  };
};

type TestStepRow = typeof testSteps.$inferSelect;

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
