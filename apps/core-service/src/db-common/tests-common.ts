import {
  afterTests,
  beforeTests,
  tests,
} from "@total-report/core-schema/schema";
import { eq } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { MD5 } from "object-hash";
import { TestContextsDAO } from "../db/test-contexts.js";
import {
  TestContextBelongsToDifferentLaunchError,
  TestContextNotFoundError,
  TestNotFoundError,
} from "../errors/errors.js";
import {
  validateTimestampsAndStatus,
  validateTitle,
} from "../validations/validations.js";
import { TestArgumentsCommonDAO } from "./test-arguments-common.js";
import { TestStepsCommonDAO } from "./test-steps-common.js";
import { applyPatchToTestRow, takeTestRowUpdateableFields } from "./tests.js";

type TestsDaoConstructor = (
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>
) => TestsCommonDAO;

type TestArgumentsDaoConstructor = (
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>
) => TestArgumentsCommonDAO;

type TestStepsDaoConstructor = (
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>
) => TestStepsCommonDAO;

type TestsTable = typeof beforeTests | typeof tests | typeof afterTests;

/**
 * Data access object for tests.
 */
export class TestsCommonDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;
  testTable: TestsTable;
  newTestsCommonDAO: TestsDaoConstructor;
  newTestArgumentsDAO: TestArgumentsDaoConstructor;
  newTestStepsDAO: TestStepsDaoConstructor;

  constructor(args: {
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;
    testTable: TestsTable;
    newTestsCommonDAO: TestsDaoConstructor;
    newTestArgumentsDAO: TestArgumentsDaoConstructor;
    newTestStepsDAO: TestStepsDaoConstructor;
  }) {
    this.db = args.db;
    this.testTable = args.testTable;
    this.newTestsCommonDAO = args.newTestsCommonDAO;
    this.newTestArgumentsDAO = args.newTestArgumentsDAO;
    this.newTestStepsDAO = args.newTestStepsDAO;
  }

  /**
   * Create a new test entity.
   *
   * @param {CreateTestArguments} args Arguments for creating a new test entity.
   * @returns Created test entity.
   * @throws {TestContextNotFoundError} if the test context is not found.
   * @throws {TestContextBelongsToDifferentLaunchError} if the test context belongs to a different launch.
   */
  async create(args: CreateTestArguments): Promise<TestEntity> {
    const result = await this.db.transaction(async (tx) => {
      const argsHash = args.arguments == undefined || args.arguments.length == 0  ? null : MD5(args.arguments);

      if (args.testContextId) {
        const testContext = await new TestContextsDAO(tx).findById(
          args.testContextId
        );

        if (testContext == undefined) {
          throw new TestContextNotFoundError(args.testContextId);
        }

        if (testContext.launchId != args.launchId) {
          throw new TestContextBelongsToDifferentLaunchError({
            testContextId: args.testContextId,
            testContextLaunchId: testContext.launchId,
            expectedLaunchId: args.launchId,
          });
        }
      }

      validate(args);

      const test = await this.insertRow(tx, args, argsHash);

      const argumentsInDb =
        args.arguments && args.arguments.length > 0
          ? await this.newTestArgumentsDAO(tx).create({
              testId: test.id,
              arguments: args.arguments,
            })
          : undefined;

      return convertToEntity({
        testRow: test,
        argumentsRows: argumentsInDb,
      });
    });

    return result;
  }

  /**
   * Find a test entity by id.
   *
   * @param id Id of the test entity.
   * @returns After test entity with the provided id.
   */
  findById(id: number): Promise<TestEntity | undefined> {
    return this.db.transaction(async (tx) => {
      const testRow = await this.db
        .select()
        .from(this.testTable)
        .where(eq(this.testTable.id, id))
        .execute()
        .then((result) => {
          if (result.length === 0) {
            return undefined;
          }
          return result[0];
        });

      if (testRow == undefined) {
        return undefined;
      }

      const testArgs = await this.newTestArgumentsDAO(tx).findByTestId(
        testRow.id
      );

      return convertToEntity({
        testRow: testRow,
        argumentsRows: testArgs,
      });
    });
  }

  /**
   * Patch a test entity.
   *
   * @param args Arguments for patching a test entity.
   * @returns Patched test entity.
   */
  patch(args: PatchTest): Promise<TestEntity> {
    return this.db.transaction(async (tx) => {
      const testRow = await this.findRowById(tx, args.id);

      if (testRow == undefined) {
        throw new TestNotFoundError(args.id);
      }

      const expectedRow = applyPatchToTestRow({
        row: testRow,
        patch: takeTestRowUpdateableFields(args),
      });

      validate(expectedRow);

      const updatedTest = (
        await tx
          .update(this.testTable)
          .set(args)
          .where(eq(this.testTable.id, args.id))
          .returning()
      ).at(0)!;

      const testArgs = await this.newTestArgumentsDAO(tx).findByTestId(
        updatedTest.id
      );

      return convertToEntity({
        testRow: updatedTest,
        argumentsRows: testArgs,
      });
    });
  }

  /**
   * Delete a test entity by id.
   *
   * @param id Id of the test entity.
   */
  async deleteById(id: number): Promise<void> {
    await this.db.transaction(async (tx) => {
      await this.newTestArgumentsDAO(tx).deleteByTestId(id);
      await tx.delete(this.testTable).where(eq(this.testTable.id, id));
    });
  }

  protected findRowById = async (
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>,
    id: number
  ) => {
    return await db
      .select()
      .from(this.testTable)
      .where(eq(this.testTable.id, id))
      .execute()
      .then((result) => {
        if (result.length === 0) {
          return undefined;
        }
        return result[0];
      });
  };

  protected insertRow = async (
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>,
    args: CreateTestArguments,
    argsHash: string | null
  ) => {
    return (
      await db
        .insert(this.testTable)
        .values({
          testContextId: args.testContextId,
          title: args.title,
          launchId: args.launchId,
          createdTimestamp: args.createdTimestamp,
          startedTimestamp: args.startedTimestamp,
          finishedTimestamp: args.finishedTimestamp,
          statusId: args.statusId,
          argumentsHash: argsHash,
        })
        .returning()
    ).at(0)!;
  };
}

export type CreateTestArguments = {
  launchId: number;
  title: string;
  createdTimestamp: Date;
  startedTimestamp?: Date;
  finishedTimestamp?: Date;
  statusId?: string;
  testContextId?: number;
  arguments?: {
    name: string;
    type: string;
    value: string | null;
  }[];
};

export type TestEntity = ReplaceNullWithUndefined<TestsRow> & {
  arguments:
    | {
        id: number;
        name: string;
        type: string;
        value: string | null;
      }[]
    | undefined;
};

export type PatchTest = {
  id: number;
  title?: string;
  createdTimestamp?: Date;
  startedTimestamp?: Date | null;
  finishedTimestamp?: Date | null;
  statusId?: string | null;
};

const validate = (args: TestEntity | TestsRow | CreateTestArguments) => {
  validateTitle(args);
  validateTimestampsAndStatus(args);
};

const convertToEntity = (args: {
  testRow: TestsRow;
  argumentsRows?: TestArgumentsRow[];
}): TestEntity => {
  return {
    launchId: args.testRow.launchId,
    testContextId: args.testRow.testContextId ?? undefined,
    id: args.testRow.id,
    title: args.testRow.title,
    createdTimestamp: args.testRow.createdTimestamp,
    startedTimestamp: args.testRow.startedTimestamp ?? undefined,
    finishedTimestamp: args.testRow.finishedTimestamp ?? undefined,
    statusId: args.testRow.statusId ?? undefined,
    argumentsHash: args.testRow.argumentsHash ?? undefined,
    arguments: args.argumentsRows?.map((arg) => ({
      id: arg.id,
      name: arg.name,
      type: arg.type,
      value: arg.value,
    })),
  };
};

const takeUpdateableFields = (args: PatchTest): UpdateableFields => {
  return {
    title: args.title,
    createdTimestamp: args.createdTimestamp,
    startedTimestamp: args.startedTimestamp,
    finishedTimestamp: args.finishedTimestamp,
    statusId: args.statusId,
  };
};

type UpdateableFields = {
  title: string | undefined;
  createdTimestamp: Date | undefined;
  startedTimestamp: Date | null | undefined;
  finishedTimestamp: Date | null | undefined;
  statusId: string | null | undefined;
};

type TestsRow = TestsTable["$inferSelect"];

type TestArgumentsRow = Awaited<
  ReturnType<typeof TestArgumentsCommonDAO.prototype.findByTestId>
>[0];

type NoNullField<T> = { [P in keyof T]: NonNullable<T[P]> };

type ReplaceNullWithUndefined<T extends Object> = {
  [k in keyof T]: null extends T[k] ? Exclude<T[k], null> | undefined : T[k];
};
