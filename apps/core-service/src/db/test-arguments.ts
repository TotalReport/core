import { testArguments } from "@total-report/core-schema/schema";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { v4 as uuidv4 } from "uuid";
import { db as defaultDB } from "./setup.js";
import { eq } from "drizzle-orm";

export class TestArgumentsDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB) {      
    this.db = db;
  }

  async create(args: CreateTestArguments) {
    return await this.db.insert(testArguments).values(
      args.arguments.map((value, index) => {
        return {
          id: uuidv4(),
          name: value.name,
          index: index,
          type: value.type,
          value: value.value,
          testId: args.testId,
        };
      })
    ).returning();
  }

  async findByTestId(testId: string) {
    return await this.db.select().from(testArguments).where(eq(testArguments.testId, testId));
  }

  async deleteByTestId(testId: string) {
    return await this.db.delete(testArguments).where(eq(testArguments.testId, testId));
  }
}

export type CreateTestArguments = {
  testId: string;
  arguments: Array<{
    name: string;
    type: string;
    value: string | null;
  }>;
};
