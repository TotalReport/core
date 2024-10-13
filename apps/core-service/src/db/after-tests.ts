import { afterTests } from "@total-report/core-schema/schema";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { TestsCommonDAO } from "../db-common/tests-common.js";
import { db as defaultDB } from "../db/setup.js";
import { AfterTestArgumentsDAO } from "./after-test-arguments.js";
import { AfterTestStepsDAO } from "./after-test-steps.js";

/**
 * Data access object for after tests.
 */
export class AfterTestsDAO extends TestsCommonDAO {
  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    super({
      db,
      testTable: afterTests,
      newTestsCommonDAO: (dbc) => new AfterTestsDAO(dbc),
      newTestArgumentsDAO: (dbc) => new AfterTestArgumentsDAO(dbc),
      newTestStepsDAO: (dbc) => new AfterTestStepsDAO(dbc),
    });
  }
}
