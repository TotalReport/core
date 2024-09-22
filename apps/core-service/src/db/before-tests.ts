import { beforeTests } from "@total-report/core-schema/schema";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { MD5 } from "object-hash";
import { v4 as uuidv4 } from "uuid";
import { BeforeTestArgumentsDAO } from "./before-test-arguments.js";
import { db as defaultDB } from "../db/setup.js";

export class BeforeTestsDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    this.db = db;
  }

  async create(args: CreateBeforeTestArguments) {
    const result = await this.db.transaction(async (tx) => {
      const argsHash = arguments == null ? null : MD5(args.arguments);

      const beforeTest = (
        await tx
          .insert(beforeTests)
          .values({
            id: uuidv4(),
            title: args.title,
            launchId: args.launchId,
            createdTimestamp: args.createdTimestamp,
            startedTimestamp: args.startedTimestamp,
            finishedTimestamp: args.finishedTimestamp,
            statusId: args.statusId,
            argumentsHash: argsHash,
          })
          .returning()
      ).at(0)!;

      const argumentsInDb = await new BeforeTestArgumentsDAO(tx).create({
        beforeTestId: beforeTest.id,
        arguments: args.arguments,
      });

      return {
        ...beforeTest,
        startedTimestamp: beforeTest.startedTimestamp ?? undefined,
        finishedTimestamp: beforeTest.finishedTimestamp ?? undefined,
        statusId: beforeTest.statusId ?? undefined,
        arguments: argumentsInDb.map((arg) => ({
          id: arg.id,
          name: arg.name,
          type: arg.type,
          value: arg.value,
        })),
      };
    });

    return result;
  }
}

export type CreateBeforeTestArguments = {
  title: string;
  launchId: string;
  createdTimestamp: string;
  startedTimestamp?: string;
  finishedTimestamp?: string;
  statusId?: string;
  arguments: {
    name: string;
    type: string;
    value: string | null;
  }[];
};
