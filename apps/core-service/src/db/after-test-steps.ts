import { afterTestSteps } from "@total-report/core-schema/schema";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { db as defaultDB } from "./setup.js";

export class AfterTestStepsDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    this.db = db;
  }

  async create(args: CreateAfterTestStep) {
    const afterTestStepsRow = (
      await this.db.insert(afterTestSteps).values(args).returning()
    ).at(0)!;
    return {
      ...afterTestStepsRow,
      startedTimestamp: afterTestStepsRow.startedTimestamp ?? undefined,
      finishedTimestamp: afterTestStepsRow.finishedTimestamp ?? undefined,
      isSuccessful: afterTestStepsRow.isSuccessful ?? undefined,
      errorMessage: afterTestStepsRow.errorMessage ?? undefined,
    };
  }
}

export type CreateAfterTestStep = {
  afterTestId: string;
  title: string;
  createdTimestamp: string;
  startedTimestamp?: string;
  finishedTimestamp?: string;
  isSuccessful?: boolean;
  errorMessage?: string;
};
