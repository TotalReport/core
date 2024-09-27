import { beforeTests } from "@total-report/core-schema/schema";
import { eq } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { MD5 } from "object-hash";
import { v4 as uuidv4 } from "uuid";
import { db as defaultDB } from "../db/setup.js";
import { BeforeTestArgumentsDAO } from "./before-test-arguments.js";
import { TestContextsDAO } from "./test-contexts.js";
import {
  TestContextBelongsToDifferentLaunchError,
  TestContextNotFoundError,
} from "../errors/errors.js";

/**
 * Data access object for before tests.
 */
export class BeforeTestsDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    this.db = db;
  }

  /**
   * Create a new before test entity.
   *
   * @param {CreateBeforeTestArguments} args Arguments for creating a new before test entity.
   * @returns Created before test entity.
   * @throws {TestContextNotFoundError} if the test context is not found.
   * @throws {TestContextBelongsToDifferentLaunchError} if the test context belongs to a different launch.
   */
  async create(args: CreateBeforeTestArguments): Promise<BeforeTestEntity> {
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

      const beforeTest = (
        await tx
          .insert(beforeTests)
          .values({
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
          ? await new BeforeTestArgumentsDAO(tx).create({
              beforeTestId: beforeTest.id,
              arguments: args.arguments,
            })
          : undefined;

      return convertToEntity({
        beforeTestRow: beforeTest,
        argumentsRows: argumentsInDb,
      });
    });

    return result;
  }

  /**
   * Find a before test entity by id.
   *
   * @param id Id of the before test entity.
   * @returns Before test entity with the provided id.
   */
  findById(id: string): Promise<BeforeTestEntity | undefined> {
    return this.db.transaction(async (tx) => {
      const beforeTestRow = await this.db
        .select()
        .from(beforeTests)
        .where(eq(beforeTests.id, id))
        .execute()
        .then((result) => {
          if (result.length === 0) {
            return undefined;
          }
          return result[0];
        });

      if (beforeTestRow == undefined) {
        return undefined;
      }

      const beforeTestArgs = await new BeforeTestArgumentsDAO(
        tx
      ).findByBeforeTestId(beforeTestRow.id);

      return convertToEntity({ beforeTestRow, argumentsRows: beforeTestArgs });
    });
  }
}

export type BeforeTestEntity = NoNullField<BeforeTestRow> & {
  arguments?: {
    id: string;
    name: string;
    type: string;
    value: string | null;
  }[];
};

const convertToEntity = (args: {
  beforeTestRow: BeforeTestRow;
  argumentsRows?: BeforeTestArgumentsRow[];
}): BeforeTestEntity => {
  return {
    launchId: args.beforeTestRow.launchId,
    testContextId: args.beforeTestRow.testContextId ?? undefined,
    id: args.beforeTestRow.id,
    title: args.beforeTestRow.title,
    createdTimestamp: args.beforeTestRow.createdTimestamp,
    startedTimestamp: args.beforeTestRow.startedTimestamp ?? undefined,
    finishedTimestamp: args.beforeTestRow.finishedTimestamp ?? undefined,
    statusId: args.beforeTestRow.statusId ?? undefined,
    argumentsHash: args.beforeTestRow.argumentsHash ?? undefined,
    arguments: args.argumentsRows?.map((arg) => ({
      id: arg.id,
      name: arg.name,
      type: arg.type,
      value: arg.value,
    })),
  };
};

export type CreateBeforeTestArguments = {
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

type BeforeTestRow = typeof beforeTests.$inferInsert;
type BeforeTestArgumentsRow = Awaited<
  ReturnType<typeof BeforeTestArgumentsDAO.prototype.findByBeforeTestId>
>[0];

type NoNullField<T> = { [P in keyof T]: NonNullable<T[P]> };
