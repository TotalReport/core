import { tests } from "@total-report/core-schema/schema";
import { eq } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { MD5 } from "object-hash";
import { v4 as uuidv4 } from "uuid";
import { TestContextBelongsToDifferentLaunchError, TestContextNotFoundError, TestNotFoundError } from "../errors/errors.js";
import {
  validateTimestampsAndStatus,
  validateTitle,
} from "../validations/validations.js";
import { db as defaultDB } from "./setup.js";
import { TestArgumentsDAO } from "./test-arguments.js";
import { TestContextsDAO } from "./test-contexts.js";

/**
 * Data access object for tests.
 */
export class TestsDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    this.db = db;
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
      const argsHash = args.arguments == undefined ? null : MD5(args.arguments);

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

      const test = (
        await tx
          .insert(tests)
          .values({
            testContextId: args.testContextId,
            id: uuidv4(),
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

      const argumentsInDb =
        args.arguments && args.arguments.length > 0
          ? await new TestArgumentsDAO(tx).create({
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
   * @returns Test entity with the provided id.
   */
  findById(id: string): Promise<TestEntity | undefined> {
    return this.db.transaction(async (tx) => {
      const testRow = await this.db
        .select()
        .from(tests)
        .where(eq(tests.id, id))
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

      const testArgs = await new TestArgumentsDAO(
        tx
      ).findByTestId(testRow.id);

      return convertToEntity({ testRow, argumentsRows: testArgs });
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
      const testRow = await new TestsDAO(tx).findById(args.id);

      if (testRow == undefined) {
        throw new TestNotFoundError(args.id);
      }

      const expectedRow = {
        ...testRow,
        ...args,
      };

      validate(expectedRow);

      const updatedTest = (
        await tx
          .update(tests)
          .set(args)
          .where(eq(tests.id, args.id))
          .returning()
      ).at(0)!;

      const testArgs = await new TestArgumentsDAO(
        tx
      ).findByTestId(updatedTest.id);

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
  async deleteById(id: string): Promise<void> {
    await this.db.transaction(async (tx) => {
      await new TestArgumentsDAO(tx).deleteByTestId(id);
      await tx.delete(tests).where(eq(tests.id, id));
    });
  }
}

export type CreateTestArguments = {
  title: string;
  launchId: string;
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

export type TestEntity = NoNullField<TestRow> & {
  arguments:
    | {
        id: string;
        name: string;
        type: string;
        value: string | null;
      }[]
    | undefined;
};

export type PatchTest = {
  id: string;
  title?: string;
  createdTimestamp?: Date;
  startedTimestamp?: Date | null;
  finishedTimestamp?: Date | null;
  statusId?: string | null;
};

const validate = (
  args: TestEntity | TestRow | CreateTestArguments
) => {
  validateTitle(args);
  validateTimestampsAndStatus(args);
};

const convertToEntity = (args: {
  testRow: TestRow;
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

type TestRow = typeof tests.$inferInsert;
type TestArgumentsRow = Awaited<
  ReturnType<typeof TestArgumentsDAO.prototype.findByTestId>
>[0];

type NoNullField<T> = { [P in keyof T]: NonNullable<T[P]> };
