import { testSteps } from "@total-report/core-schema/schema";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { db as defaultDB } from "./setup.js";

export class TestStepsDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    this.db = db;
  }

  async create(args: CreateTestStep) {
    const testStepsRow = (
      await this.db.insert(testSteps).values(args).returning()
    ).at(0)!;
    return {
      ...testStepsRow,
      startedTimestamp: testStepsRow.startedTimestamp ?? undefined,
      finishedTimestamp: testStepsRow.finishedTimestamp ?? undefined,
      isSuccessful: testStepsRow.isSuccessful ?? undefined,
      errorMessage: testStepsRow.errorMessage ?? undefined,
    };
  }
}

export type CreateTestStep = {
  testId: string;
  title: string;
  createdTimestamp: string;
  startedTimestamp?: string;
  finishedTimestamp?: string;
  isSuccessful?: boolean;
  errorMessage?: string;
};
