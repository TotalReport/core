import { afterTests } from "@total-report/core-schema/schema";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { MD5 } from "object-hash";
import { v4 as uuidv4 } from "uuid";
import { AfterTestArgumentsDAO } from "./after-test-arguments.js";
import { db as defaultDB } from "./setup.js";
import { TestContextsDAO } from "./test-contexts.js";

export class AfterTestsDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    this.db = db;
  }

  async create(args: CreateAfterTestArguments) {
    const result = await this.db.transaction(async (tx) => {
      const argsHash = args.arguments == undefined ? undefined : MD5(args.arguments);

      if (args.testContextId) {
        const testContext = await new TestContextsDAO(tx).findById(
          args.testContextId
        );
        if (testContext?.launchId != args.launchId) {
          throw new Error(
            `Test context with id ${args.testContextId} has launchId ${testContext?.launchId} which is different from provided launchId ${args.launchId}`
          );
        }
      }

      const afterTest = (
        await tx
          .insert(afterTests)
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

      const argumentsInDb = args.arguments == undefined ? undefined : await new AfterTestArgumentsDAO(tx).create({
        afterTestId: afterTest.id,
        arguments: args.arguments,
      });

      return {
        ...afterTest,
        startedTimestamp: afterTest.startedTimestamp ?? undefined,
        finishedTimestamp: afterTest.finishedTimestamp ?? undefined,
        testContextId: afterTest.testContextId ?? undefined,
        statusId: afterTest.statusId ?? undefined,
        argumentsHash: afterTest.argumentsHash ?? undefined,
        arguments: argumentsInDb == undefined ? undefined : argumentsInDb.map((arg) => ({
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

export type CreateAfterTestArguments = {
  title: string;
  launchId: string;
  createdTimestamp: string;
  startedTimestamp?: string;
  finishedTimestamp?: string;
  statusId?: string;
  testContextId?: number;
  arguments?: {
    name: string;
    type: string;
    value: string | null;
  }[];
};
