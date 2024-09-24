import { beforeTestSteps } from "@total-report/core-schema/schema";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { db as defaultDB } from "../db/setup.js";

export class BeforeTestStepsDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    this.db = db;
  }

  async create(args: CreateBeforeTestStep) {
    const beforeTestStepsRow = (
      await this.db.insert(beforeTestSteps).values(args).returning()
    ).at(0)!;
    return {
      ...beforeTestStepsRow,
      startedTimestamp: beforeTestStepsRow.startedTimestamp ?? undefined,
      finishedTimestamp: beforeTestStepsRow.finishedTimestamp ?? undefined,
      isSuccessful: beforeTestStepsRow.isSuccessful ?? undefined,
      errorMessage: beforeTestStepsRow.errorMessage ?? undefined,
    };
  }
}

export type CreateBeforeTestStep = {
  beforeTestId: string;
  title: string;
  createdTimestamp: string;
  startedTimestamp?: string;
  finishedTimestamp?: string;
  isSuccessful?: boolean;
  errorMessage?: string;
};
