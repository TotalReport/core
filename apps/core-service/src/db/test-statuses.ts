import { testStatuses } from "@total-report/core-schema/schema";
import { desc, eq } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { PgDatabase } from "drizzle-orm/pg-core";
import { db as defaultDB } from "./setup.js";

interface TestStatusEntity {
  id: string;
  title: string;
  createdTimestamp: Date;
  groupId: string;
  color: string;
}

export class TestStatusesDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    this.db = db;
  }

  async findById(id: string): Promise<TestStatusEntity | undefined> {
    const results = await this.db
      .select()
      .from(testStatuses)
      .where(eq(testStatuses.id, id));

    if (results.length === 0) {
      return undefined;
    }

    const result = results[0]!;
    return {
      id: result.id,
      title: result.title,
      createdTimestamp: result.createdTimestamp,
      groupId: result.groupId,
      color: result.color,
    };
  }

  async find(): Promise<TestStatusEntity[]> {
    const statuses = await this.db
      .select()
      .from(testStatuses)
      .orderBy(desc(testStatuses.createdTimestamp));

    return statuses.map((item) => ({
      id: item.id,
      title: item.title,
      createdTimestamp: new Date(item.createdTimestamp),
      groupId: item.groupId,
      color: item.color,
    }));
  }
}
