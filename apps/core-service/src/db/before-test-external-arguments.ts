import { beforeTestExternalArguments } from "@total-report/core-schema/schema";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { TestArgumentsCommonDAO } from "../db-common/test-arguments-common.js";
import { db as defaultDB } from "./setup.js";

export class BeforeTestExternalArgumentsDAO extends TestArgumentsCommonDAO {
  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    super({ db, testArgumentsTable: beforeTestExternalArguments });
  }
}
