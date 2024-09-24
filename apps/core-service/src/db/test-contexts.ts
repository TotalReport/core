import { testContexts } from "@total-report/core-schema/schema";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { db as defaultDB } from "../db/setup.js";
import { eq } from "drizzle-orm";

export class TestContextsDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    this.db = db;
  }

  async create(args: CreateTestContext) {
    const testContextRow = (
      await this.db
        .insert(testContexts)
        .values({
          title: args.title,
          createdTimestamp: args.createdTimestamp,
          startedTimestamp: args.startedTimestamp,
          finishedTimestamp: args.finishedTimestamp,
          launchId: args.launchId,
          parentTestContextId: args.parentTestContextId,
        })
        .returning()
    ).at(0)!;
    return {
      ...testContextRow,
      startedTimestamp: testContextRow.startedTimestamp ?? undefined,
      finishedTimestamp: testContextRow.finishedTimestamp ?? undefined,
      parentTestContextId: testContextRow.parentTestContextId ?? undefined,
    };
  }

  async findById(id: number) {
    return (
      await this.db.select().from(testContexts).where(eq(testContexts.id, id))
    ).at(0);
  }
}

export type CreateTestContext = {
  title: string;
  createdTimestamp: string;
  startedTimestamp?: string;
  finishedTimestamp?: string;
  launchId: string;
  parentTestContextId?: number;
};
