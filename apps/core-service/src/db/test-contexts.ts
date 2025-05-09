import { testContexts } from "@total-report/core-schema/schema";
import { and, count, eq, isNull } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { Paginated, PaginationParams } from "../db-common/types.js";
import { db as defaultDB } from "../db/setup.js";
import {
  ParentTestContextBelongsToDifferentLaunchError,
  ParentTestContextHasCircularParentTestContextReferenceError,
  ParentTestContextNotFoundError,
} from "../errors/errors.js";
import { validateTimestamps } from "../validations/validations.js";

export class TestContextsDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    this.db = db;
  }

  /**
   * Create the test context.
   *
   * @param args The create test context parameters.
   * @returns The created test context.
   */
  async create(args: CreateTestContext): Promise<TestContextEntity> {
    validateTitleAndTimestamps(args);

    const testContextRow = await this.db.transaction(async (tx) => {
      await validateParentTestContext(tx, args);

      return (
        await tx
          .insert(testContexts)
          .values({
            parentTestContextId: args.parentTestContextId,
            launchId: args.launchId,
            title: args.title,
            createdTimestamp: args.createdTimestamp,
            startedTimestamp: args.startedTimestamp,
            finishedTimestamp: args.finishedTimestamp,
          })
          .returning()
      ).at(0)!;
    });

    return convertToEntity(testContextRow);
  }

  async findById(id: number) {
    return (
      await this.db.select().from(testContexts).where(eq(testContexts.id, id))
    ).at(0);
  }

  /**
   * Patch the test context fields.
   *
   * @param args The patch test context parameters.
   * @returns The patched test context.
   */
  async patch(args: PatchTestContext): Promise<TestContextEntity> {
    const result = await this.db.transaction(async (tx) => {
      const launchFromDb = await new TestContextsDAO(tx).findById(args.id);

      if (launchFromDb === undefined) {
        throw new Error(`Test context with id ${args.id} not found`);
      }

      let update: SetColumnsValues = convertToSetColumns(args);

      const expectedRow = {
        ...launchFromDb,
        ...update,
      };

      validateTitleAndTimestamps(expectedRow);

      await tx
        .update(testContexts)
        .set(update)
        .where(eq(testContexts.id, args.id));

      return (await new TestContextsDAO(tx).findById(args.id))!;
    });

    return convertToEntity(result);
  }

  /**
   * Find test contexts by launch ID.
   *
   * @param launchId The launch ID.
   * @param pagination The pagination parameters.
   * @returns The paginated list of test contexts.
   */
  async findByLaunchId(
    launchId: number,
    pagination: PaginationParams
  ): Promise<Paginated<TestContextEntity>> {
    const data = await this.db.transaction(async (tx) => {
      const filter = and(
        eq(testContexts.launchId, launchId),
        isNull(testContexts.parentTestContextId)
      );

      const items = await tx
        .select()
        .from(testContexts)
        .where(filter)
        .orderBy(testContexts.startedTimestamp, testContexts.createdTimestamp)
        .limit(pagination.limit)
        .offset(pagination.offset);

      const total =
        (
          await tx.select({ value: count() }).from(testContexts).where(filter)
        ).at(0)?.value ?? 0;

      return {
        items,
        total,
      };
    });

    return {
      pagination: {
        total: data.total,
        limit: pagination.limit,
        offset: pagination.offset,
      },
      items: data.items.map(convertToEntity),
    };
  }

  /**
   * Delete the test context by ID.
   *
   * @param id The test context ID.
   */
  async deleteById(id: number): Promise<void> {
    await this.db.delete(testContexts).where(eq(testContexts.id, id));
  }
}

export type CreateTestContext = {
  launchId: number;
  parentTestContextId?: number;
  title: string;
  createdTimestamp: Date;
  startedTimestamp?: Date;
  finishedTimestamp?: Date;
};

export type TestContextEntity = {
  parentTestContextId?: number;
  launchId: number;
  id: number;
  title: string;
  createdTimestamp: Date;
  startedTimestamp?: Date;
  finishedTimestamp?: Date;
};

export type PatchTestContext = {
  id: number;
  title?: string;
  createdTimestamp?: Date;
  startedTimestamp?: Date | null;
  finishedTimestamp?: Date | null;
};

type TestContextRow = {
  parentTestContextId: number | null;
  launchId: number;
  id: number;
  title: string;
  createdTimestamp: Date;
  startedTimestamp: Date | null;
  finishedTimestamp: Date | null;
};

type SetColumnsValues = {
  title?: string;
  createdTimestamp?: Date;
  startedTimestamp?: Date | null;
  finishedTimestamp?: Date | null;
};

const validateTitleAndTimestamps = (args: {
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

async function validateParentTestContext(
  tx: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>,
  args: CreateTestContext
) {
  if (args.parentTestContextId != undefined) {
    const parentTestContextsIds = Array<number>();

    let currentParentTestContextId: number | undefined | null =
      args.parentTestContextId;

    //TODO - Replace with postgresql's `WITH RECURSIVE`.
    while (currentParentTestContextId != null) {
      const parentTestContext = await new TestContextsDAO(tx).findById(
        currentParentTestContextId
      );

      if (parentTestContext == undefined) {
        throw new ParentTestContextNotFoundError(currentParentTestContextId);
      }

      if (parentTestContext.launchId != args.launchId) {
        throw new ParentTestContextBelongsToDifferentLaunchError({
          parentTestContextId: parentTestContext.id,
          parentTestContextLaunchId: parentTestContext.launchId,
          expectedLaunchId: args.launchId,
        });
      }

      if (parentTestContextsIds.includes(parentTestContext.id)) {
        throw new ParentTestContextHasCircularParentTestContextReferenceError(
          currentParentTestContextId
        );
      }

      parentTestContextsIds.push(parentTestContext.id);
      currentParentTestContextId = parentTestContext.parentTestContextId;
    }
  }
}

const convertToEntity = (testContextRow: TestContextRow): TestContextEntity => {
  return {
    ...testContextRow,
    parentTestContextId: testContextRow.parentTestContextId ?? undefined,
    startedTimestamp: testContextRow.startedTimestamp ?? undefined,
    finishedTimestamp: testContextRow.finishedTimestamp ?? undefined,
  };
};

const convertToSetColumns = (args: PatchTestContext) => {
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
