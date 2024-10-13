import { afterTestSteps } from "@total-report/core-schema/schema";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { TestStepsCommonDAO } from "../db-common/test-steps-common.js";
import { db as defaultDB } from "../db/setup.js";

export class AfterTestStepsDAO extends TestStepsCommonDAO {
  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    super({
      db,
      testStepsTable: afterTestSteps,
      thisNewInstance: (
        dbc: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>
      ) => new AfterTestStepsDAO(dbc),
    });
  }
}
