import { testContexts } from "@total-report/core-schema/schema";
import { eq } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { db as defaultDB } from "../db/setup.js";
import {
  ParentTestContextBelongsToDifferentLaunchError,
  ParentTestContextHasCircularParentTestContextReferenceError,
  ParentTestContextNotFoundError,
} from "../errors/errors.js";
import { validateTimestamps } from "../validations/timestamps-validations.js";

export class TestContextsDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    this.db = db;
  }

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

  async deleteById(id: number): Promise<void> {
    await this.db.delete(testContexts).where(eq(testContexts.id, id));
  }
}

export type CreateTestContext = {
  launchId: string;
  parentTestContextId?: number;
  title: string;
  createdTimestamp: Date;
  startedTimestamp?: Date;
  finishedTimestamp?: Date;
};

export type TestContextEntity = {
  parentTestContextId?: number;
  launchId: string;
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
  launchId: string;
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
