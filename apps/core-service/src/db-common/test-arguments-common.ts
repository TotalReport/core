import { afterTestArguments, beforeTestArguments, testArguments } from "@total-report/core-schema/schema";
import { eq } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";

export class TestArgumentsCommonDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;
  testArgumentsTable: TestArgumentsTable;

  constructor(args: {
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;
    testArgumentsTable: TestArgumentsTable;
  }) {
    this.db = args.db;
    this.testArgumentsTable = args.testArgumentsTable;
  }

  async create(args: CreateTestArguments) {
    return await this.db
      .insert(this.testArgumentsTable)
      .values(
        args.arguments.map((value, index) => {
          return {
            name: value.name,
            index: index,
            type: value.type,
            value: value.value,
            testId: args.testId,
          };
        })
      )
      .returning();
  }

  async findByTestId(testId: number) {
    return await this.db
      .select()
      .from(this.testArgumentsTable)
      .where(eq(this.testArgumentsTable.testId, testId));
  }

  async deleteByTestId(testId: number) {
    return await this.db
      .delete(this.testArgumentsTable)
      .where(eq(this.testArgumentsTable.testId, testId));
  }
}

export type TestArgumentsTable = typeof beforeTestArguments | typeof testArguments | typeof afterTestArguments;

export type CreateTestArguments = {
  testId: number;
  arguments: Array<{
    name: string;
    type: string;
    value: string | null;
  }>;
};
