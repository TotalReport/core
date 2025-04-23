import { testStatusGroups } from "@total-report/core-schema/schema";
import { desc, eq } from "drizzle-orm";
import { db as defaultDB } from "./setup.js";
import { PgDatabase } from "drizzle-orm/pg-core";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";

interface TestStatusGroupEntity {
  id: string;
  title: string;
  createdTimestamp: Date;
  color: string;
}

export class TestStatusGroupsDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    this.db = db;
  }

  async findById(id: string): Promise<TestStatusGroupEntity | undefined> {
    const results = await this.db
      .select()
      .from(testStatusGroups)
      .where(eq(testStatusGroups.id, id));

    if (results.length === 0) {
      return undefined;
    }

    const result = results[0]!;
    return {
      id: result.id,
      title: result.title,
      createdTimestamp: result.createdTimestamp,
      color: result.color,
    };
  }

  async find(): Promise<TestStatusGroupEntity[]> {
    const statusGroups = await this.db
      .select()
      .from(testStatusGroups)
      .orderBy(desc(testStatusGroups.createdTimestamp));

    return statusGroups.map((item) => ({
      id: item.id,
      title: item.title,
      createdTimestamp: new Date(item.createdTimestamp),
      color: item.color,
    }));
  }
}
