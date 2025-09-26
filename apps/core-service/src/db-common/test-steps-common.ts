import {
  afterTestSteps,
  beforeTestSteps,
  testSteps,
} from "@total-report/core-schema/schema";
import { eq } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { TestStepNotFoundError } from "../errors/errors.js";
import {
  validateTimestampsAndSuccess,
  validateTitle,
} from "../validations/validations.js";

export class TestStepsCommonDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;
  testStepsTable: TestStepsTable;
  thisNewInstance: (db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>) => TestStepsCommonDAO;

  constructor(args: {
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;
    testStepsTable: TestStepsTable;
    thisNewInstance: (db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>) => TestStepsCommonDAO
  }) {
    this.db = args.db;
    this.testStepsTable = args.testStepsTable;
    this.thisNewInstance = args.thisNewInstance;
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
      await this.db.insert(this.testStepsTable).values(args).returning()
    ).at(0)!;

    return {
      ...testStepsRow,
      startedTimestamp: testStepsRow.startedTimestamp ?? undefined,
      finishedTimestamp: testStepsRow.finishedTimestamp ?? undefined,
      isSuccessful: testStepsRow.isSuccessful ?? undefined,
      errorMessage: testStepsRow.errorMessage ?? undefined,
      thread: testStepsRow.thread ?? undefined,
      process: testStepsRow.process ?? undefined,
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
      .from(this.testStepsTable)
      .where(eq(this.testStepsTable.id, id))
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
  async findByTestId(testId: number): Promise<TestStepEntity[]> {
    return await this.db
      .select()
      .from(this.testStepsTable)
      .where(eq(this.testStepsTable.testId, testId))
      .orderBy(this.testStepsTable.startedTimestamp, this.testStepsTable.finishedTimestamp, this.testStepsTable.createdTimestamp)
      .then((rows) => rows.map(convertRowToEntity));
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
        .from(this.testStepsTable)
        .where(eq(this.testStepsTable.id, args.id))
        .then((rows) => rows[0]);

      if (row == undefined) {
        throw new TestStepNotFoundError(args.id);
      }

      const patch = takeUpdateableFields(args);

      validate(applyPatch({ row, patch }));

      await tx
        .update(this.testStepsTable)
        .set(patch)
        .where(eq(this.testStepsTable.id, args.id));

      return (await this.thisNewInstance(tx).findById(args.id))!;
    });
  }

  /**
   * Deletes all test steps for a test.
   *
   * @param testId The ID of the test to delete steps for.
   */
  async deleteByTestId(testId: number): Promise<void> {
    await this.db
      .delete(this.testStepsTable)
      .where(eq(this.testStepsTable.testId, testId));
  }

  /**
   * Deletes a test step by its ID.
   *
   * @param id The ID of the test step to delete.
   */
  async deleteById(id: number): Promise<void> {
    await this.db
      .delete(this.testStepsTable)
      .where(eq(this.testStepsTable.id, id));
  }
}

export type CreateTestStep = {
  testId: number;
  title: string;
  createdTimestamp: Date;
  startedTimestamp: Date | undefined;
  finishedTimestamp: Date | undefined;
  isSuccessful: boolean | undefined;
  errorMessage: string | undefined;
  thread: string | undefined;
  process: string | undefined;
};

export type PatchTestStep = {
  id: number;
  title: string | undefined;
  createdTimestamp: Date | undefined;
  startedTimestamp: Date | null | undefined;
  finishedTimestamp: Date | null | undefined;
  isSuccessful: boolean | null | undefined;
  errorMessage: string | null | undefined;
  thread: string | null | undefined;
  process: string | null | undefined;
};

export type TestStepEntity = ReplaceNullWithUndefined<TestStepsRow>;

const takeUpdateableFields = (args: PatchTestStep): UpdateableFields => {
  return {
    title: args.title,
    createdTimestamp: args.createdTimestamp,
    startedTimestamp: args.startedTimestamp,
    finishedTimestamp: args.finishedTimestamp,
    isSuccessful: args.isSuccessful,
    errorMessage: args.errorMessage,
    thread: args.thread,
    process: args.process,
  };
};


const validate = (args: CreateTestStep | TestStepsRow) => {
  validateTitle(args);
  validateTimestampsAndSuccess(args);
};

const applyPatch = (args: {
  row: TestStepsRow;
  patch: UpdateableFields;
}): TestStepsRow => {
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
    thread: firstNotUndefined(
      args.patch.thread,
      args.row.thread
    ),
    process: firstNotUndefined(
      args.patch.process,
      args.row.process
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

const convertRowToEntity = (row: TestStepsRow): TestStepEntity => {
  return {
    testId: row.testId,
    id: row.id,
    title: row.title,
    createdTimestamp: row.createdTimestamp,
    startedTimestamp: nullToUndefined(row.startedTimestamp),
    finishedTimestamp: nullToUndefined(row.finishedTimestamp),
    isSuccessful: nullToUndefined(row.isSuccessful),
    errorMessage: nullToUndefined(row.errorMessage),
    thread: nullToUndefined(row.thread),
    process: nullToUndefined(row.process),
  };
};

const nullToUndefined = <T>(
  value: NonNullable<T> | null
): NonNullable<T> | undefined => {
  return value === null ? undefined : value;
};


export type TestStepsTable =
  | typeof beforeTestSteps
  | typeof testSteps
  | typeof afterTestSteps;

export type TestStepsRow = TestStepsTable["$inferSelect"];

type UpdateableFields = {
  title: string | undefined;
  createdTimestamp: Date | undefined;
  startedTimestamp: Date | null | undefined;
  finishedTimestamp: Date | null | undefined;
  isSuccessful: boolean | null | undefined;
  errorMessage: string | null | undefined;
  thread: string | null | undefined;
  process: string | null | undefined;
};

type ReplaceNullWithUndefined<T extends Object> = {
  [k in keyof T]: null extends T[k] ? Exclude<T[k], null> | undefined : T[k];
};
