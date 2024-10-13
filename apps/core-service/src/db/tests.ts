import { tests } from "@total-report/core-schema/schema";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { TestsCommonDAO } from "../db-common/tests-common.js";
import { db as defaultDB } from "./setup.js";
import { TestArgumentsDAO } from "./test-arguments.js";
import { TestStepsDAO } from "./test-steps.js";

/**
 * Data access object for tests.
 */
export class TestsDAO extends TestsCommonDAO {
  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    super({
      db,
      testTable: tests,
      newTestsCommonDAO: (dbc) => new TestsDAO(dbc),
      newTestArgumentsDAO: (dbc) => new TestArgumentsDAO(dbc),
      newTestStepsDAO: (dbc) => new TestStepsDAO(dbc),
    });
  }
}
