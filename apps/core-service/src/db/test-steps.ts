import { testSteps } from "@total-report/core-schema/schema";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { db as defaultDB } from "../db/setup.js";
import { TestStepsCommonDAO } from "../db-common/test-steps-common.js";

export class TestStepsDAO extends TestStepsCommonDAO {
  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    super({
      db,
      testStepsTable: testSteps,
      thisNewInstance: (
        dbc: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>
      ) => new TestStepsDAO(dbc),
    });
  }
}
