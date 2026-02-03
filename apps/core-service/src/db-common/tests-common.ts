import {
  afterTests,
  beforeTests,
  tests
} from "@total-report/core-schema/schema";
import { and, count, eq } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import {
  TestNotFoundError
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
  newTestExternalArgumentsDAO: TestArgumentsDaoConstructor;
  newTestStepsDAO: TestStepsDaoConstructor;

  constructor(args: {
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;
    testTable: TestsTable;
    newTestsCommonDAO: TestsDaoConstructor;
    newTestArgumentsDAO: TestArgumentsDaoConstructor;
    newTestExternalArgumentsDAO: TestArgumentsDaoConstructor;
    newTestStepsDAO: TestStepsDaoConstructor;
  }) {
    this.db = args.db;
    this.testTable = args.testTable;
    this.newTestsCommonDAO = args.newTestsCommonDAO;
    this.newTestArgumentsDAO = args.newTestArgumentsDAO;
    this.newTestExternalArgumentsDAO = args.newTestExternalArgumentsDAO;
    this.newTestStepsDAO = args.newTestStepsDAO;
  }

  /**
   * Create a new test entity.
   *
   * @param {CreateTestArguments} args Arguments for creating a new test entity.
   * @returns Created test entity.
   */
  async create(args: CreateTestArguments): Promise<TestEntity> {
    const result = await this.db.transaction(async (tx) => {
      validate(args);

      const test = await this.insertRow(tx, args);

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
   * Find test entities based on the provided arguments.
   *
   * @param args Arguments for finding test entities.
   * @returns Found test entities and total count.
   */
  async find(args: {
    limit: number;
    offset: number;
    launchId?: number;
    correlationId?: string;
    argumentsHash?: string;
  }): Promise<{ items: TestEntity[]; totalItems: number }> {
    const whereConditions = [
      args.launchId ? eq(this.testTable.launchId, args.launchId) : undefined,
      args.correlationId
        ? eq(this.testTable.correlationId, args.correlationId)
        : undefined,
      args.argumentsHash
        ? eq(this.testTable.argumentsHash, args.argumentsHash)
        : undefined,
    ].filter(Boolean);

    const items = await this.db
      .select()
      .from(this.testTable)
      .where(and(...whereConditions))
      .limit(args.limit)
      .offset(args.offset)
      .execute();

    const totalItems =
      (
        await this.db
          .select({ count: count(this.testTable.id) })
          .from(this.testTable)
          .where(and(...whereConditions))
          .execute()
      ).at(0)?.count ?? 0;

    // FIXME: HARDLY INNNEFICIENT! Optimize by moving arguments into JSON column of test
    const responseItems = await Promise.all(
      items.map(async (item) => {
        const testArgs = await this.newTestArgumentsDAO(this.db).findByTestId(
          item.id
        );
        const testExternalArgs = await this.newTestExternalArgumentsDAO(
          this.db,
        ).findByTestId(item.id);
        return convertToEntity({
          testRow: item,
          argumentsRows: testArgs,
          externalArgumentsRows: testExternalArgs,
        });
      }),
    );

    return {
      items: responseItems,
      totalItems,
    };
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
    args: CreateTestArguments
  ) => {
    return (
      await db
        .insert(this.testTable)
        .values({
          title: args.title,
          launchId: args.launchId,
          createdTimestamp: args.createdTimestamp,
          startedTimestamp: args.startedTimestamp,
          finishedTimestamp: args.finishedTimestamp,
          statusId: args.statusId,
          correlationId: args.correlationId,
          argumentsHash: args.argumentsHash,
          externalArgumentsHash: args.externalArgumentsHash,
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
  arguments?: {
    name: string;
    type: string;
    value: string | null;
  }[];
  externalArguments?: {
    name: string;
    type: string;
    value: string | null;
  }[];
  correlationId: string;
  argumentsHash: string;
  externalArgumentsHash: string;
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
  externalArguments:
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
  externalArgumentsRows?: TestExternalArgumentsRow[];
}): TestEntity => {
  return {
    launchId: args.testRow.launchId,
    id: args.testRow.id,
    title: args.testRow.title,
    createdTimestamp: args.testRow.createdTimestamp,
    startedTimestamp: args.testRow.startedTimestamp ?? undefined,
    finishedTimestamp: args.testRow.finishedTimestamp ?? undefined,
    statusId: args.testRow.statusId ?? undefined,
    arguments: args.argumentsRows?.map((arg) => ({
      id: arg.id,
      name: arg.name,
      type: arg.type,
      value: arg.value,
    })),
    externalArguments: args.externalArgumentsRows?.map((arg) => ({
      id: arg.id,
      name: arg.name,
      type: arg.type,
      value: arg.value,
    })),
    correlationId: args.testRow.correlationId,
    argumentsHash: args.testRow.argumentsHash,
    externalArgumentsHash: args.testRow.externalArgumentsHash,
  };
};


type TestsRow = TestsTable["$inferSelect"];

type TestArgumentsRow = Awaited<
  ReturnType<typeof TestArgumentsCommonDAO.prototype.findByTestId>
>[0];

type TestExternalArgumentsRow = Awaited<
  ReturnType<typeof TestArgumentsCommonDAO.prototype.findByTestId>
>[0];

type NoNullField<T> = { [P in keyof T]: NonNullable<T[P]> };

type ReplaceNullWithUndefined<T extends Object> = {
  [k in keyof T]: null extends T[k] ? Exclude<T[k], null> | undefined : T[k];
};
