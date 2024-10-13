import { afterTestArguments } from "@total-report/core-schema/schema";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { TestArgumentsCommonDAO } from "../db-common/test-arguments-common.js";
import { db as defaultDB } from "../db/setup.js";

export class AfterTestArgumentsDAO extends TestArgumentsCommonDAO {
  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    super({ db, testArgumentsTable: afterTestArguments });
  }
}
