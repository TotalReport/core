import { afterTests } from "@total-report/core-schema/schema";
import { eq } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { MD5 } from "object-hash";
import { v4 as uuidv4 } from "uuid";
import { db as defaultDB } from "../db/setup.js";
import {
  AfterTestNotFoundError,
  TestContextBelongsToDifferentLaunchError,
  TestContextNotFoundError,
} from "../errors/errors.js";
import {
  validateTimestampsAndStatus,
  validateTitle,
} from "../validations/validations.js";
import { AfterTestArgumentsDAO } from "./after-test-arguments.js";
import { TestContextsDAO } from "./test-contexts.js";

/**
 * Data access object for after tests.
 */
export class AfterTestsDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    this.db = db;
  }

  /**
   * Create a new after test entity.
   *
   * @param {CreateAfterTestArguments} args Arguments for creating a new after test entity.
   * @returns Created after test entity.
   * @throws {TestContextNotFoundError} if the test context is not found.
   * @throws {TestContextBelongsToDifferentLaunchError} if the test context belongs to a different launch.
   */
  async create(args: CreateAfterTestArguments): Promise<AfterTestEntity> {
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

      const afterTest = (
        await tx
          .insert(afterTests)
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
          ? await new AfterTestArgumentsDAO(tx).create({
              afterTestId: afterTest.id,
              arguments: args.arguments,
            })
          : undefined;

      return convertToEntity({
        afterTestRow: afterTest,
        argumentsRows: argumentsInDb,
      });
    });

    return result;
  }

  /**
   * Find a after test entity by id.
   *
   * @param id Id of the after test entity.
   * @returns After test entity with the provided id.
   */
  findById(id: string): Promise<AfterTestEntity | undefined> {
    return this.db.transaction(async (tx) => {
      const afterTestRow = await this.db
        .select()
        .from(afterTests)
        .where(eq(afterTests.id, id))
        .execute()
        .then((result) => {
          if (result.length === 0) {
            return undefined;
          }
          return result[0];
        });

      if (afterTestRow == undefined) {
        return undefined;
      }

      const afterTestArgs = await new AfterTestArgumentsDAO(
        tx
      ).findByAfterTestId(afterTestRow.id);

      return convertToEntity({ afterTestRow, argumentsRows: afterTestArgs });
    });
  }

  /**
   * Patch a after test entity.
   *
   * @param args Arguments for patching a after test entity.
   * @returns Patched after test entity.
   */
  patch(args: PatchAfterTest): Promise<AfterTestEntity> {
    return this.db.transaction(async (tx) => {
      const afterTestRow = await new AfterTestsDAO(tx).findById(args.id);

      if (afterTestRow == undefined) {
        throw new AfterTestNotFoundError(args.id);
      }

      const expectedRow = {
        ...afterTestRow,
        ...args,
      };

      validate(expectedRow);

      const updatedAfterTest = (
        await tx
          .update(afterTests)
          .set(args)
          .where(eq(afterTests.id, args.id))
          .returning()
      ).at(0)!;

      const afterTestArgs = await new AfterTestArgumentsDAO(
        tx
      ).findByAfterTestId(updatedAfterTest.id);

      return convertToEntity({
        afterTestRow: updatedAfterTest,
        argumentsRows: afterTestArgs,
      });
    });
  }

  /**
   * Delete a after test entity by id.
   *
   * @param id Id of the after test entity.
   */
  async deleteById(id: string): Promise<void> {
    await this.db.transaction(async (tx) => {
      await new AfterTestArgumentsDAO(tx).deleteByAfterTestId(id);
      await tx.delete(afterTests).where(eq(afterTests.id, id));
    });
  }
}

export type CreateAfterTestArguments = {
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

export type AfterTestEntity = NoNullField<AfterTestRow> & {
  arguments:
    | {
        id: string;
        name: string;
        type: string;
        value: string | null;
      }[]
    | undefined;
};

export type PatchAfterTest = {
  id: string;
  title?: string;
  createdTimestamp?: Date;
  startedTimestamp?: Date | null;
  finishedTimestamp?: Date | null;
  statusId?: string | null;
};

const validate = (
  args: AfterTestEntity | AfterTestRow | CreateAfterTestArguments
) => {
  validateTitle(args);
  validateTimestampsAndStatus(args);
};

const convertToEntity = (args: {
  afterTestRow: AfterTestRow;
  argumentsRows?: AfterTestArgumentsRow[];
}): AfterTestEntity => {
  return {
    launchId: args.afterTestRow.launchId,
    testContextId: args.afterTestRow.testContextId ?? undefined,
    id: args.afterTestRow.id,
    title: args.afterTestRow.title,
    createdTimestamp: args.afterTestRow.createdTimestamp,
    startedTimestamp: args.afterTestRow.startedTimestamp ?? undefined,
    finishedTimestamp: args.afterTestRow.finishedTimestamp ?? undefined,
    statusId: args.afterTestRow.statusId ?? undefined,
    argumentsHash: args.afterTestRow.argumentsHash ?? undefined,
    arguments: args.argumentsRows?.map((arg) => ({
      id: arg.id,
      name: arg.name,
      type: arg.type,
      value: arg.value,
    })),
  };
};

type AfterTestRow = typeof afterTests.$inferInsert;
type AfterTestArgumentsRow = Awaited<
  ReturnType<typeof AfterTestArgumentsDAO.prototype.findByAfterTestId>
>[0];

type NoNullField<T> = { [P in keyof T]: NonNullable<T[P]> };
