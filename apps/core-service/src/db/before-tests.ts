import { beforeTests } from "@total-report/core-schema/schema";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { TestsCommonDAO } from "../db-common/tests-common.js";
import { db as defaultDB } from "../db/setup.js";
import { BeforeTestArgumentsDAO } from "./before-test-arguments.js";
import { BeforeTestStepsDAO } from "./before-test-steps.js";
import { BeforeTestExternalArgumentsDAO } from "./before-test-external-arguments.js";

/**
 * Data access object for before tests.
 */
export class BeforeTestsDAO extends TestsCommonDAO {
  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    super({
      db,
      testTable: beforeTests,
      newTestsCommonDAO: (dbc) => new BeforeTestsDAO(dbc),
      newTestArgumentsDAO: (dbc) => new BeforeTestArgumentsDAO(dbc),
      newTestStepsDAO: (dbc) => new BeforeTestStepsDAO(dbc),
      newTestExternalArgumentsDAO: (dbc) =>
        new BeforeTestExternalArgumentsDAO(dbc),
    });
  }
}
