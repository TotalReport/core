import { beforeTestArguments } from "@total-report/core-schema/schema";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { v4 as uuidv4 } from "uuid";
import { db as defaultDB } from "../db/setup.js";

export class BeforeTestArgumentsDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB) {      
    this.db = db;
  }

  async create(args: CreateBeforeTestArgumentsParameters) {
    return await this.db.insert(beforeTestArguments).values(
      args.arguments.map((value, index) => {
        return {
          id: uuidv4(),
          name: value.name,
          index: index,
          type: value.type,
          value: value.value,
          beforeTestId: args.beforeTestId,
        };
      })
    ).returning();
  }
}

export type CreateBeforeTestArgumentsParameters = {
  beforeTestId: string;
  arguments: Array<{
    name: string;
    type: string;
    value: string | null;
  }>;
};