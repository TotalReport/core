import { testEntities } from "@total-report/core-schema/schema";
import { and, asc, count, eq, SQLWrapper } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { PgDatabase } from "drizzle-orm/pg-core";
import { Paginated, PaginationParams } from "../db-common/types.js";
import { db as defaultDB } from "../db/setup.js";

/**
 * Data access object for test entities. Test entities are contexts, before tests, tests, after tests.
 */
export class TestEntitiesDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    this.db = db;
  }

  /**
   * Find test entities.
   * 
   * @param search The search parameters.
   * @param pagination The pagination parameters.
   * @returns The paginated list of test entities.
   */
  async find(
    search: TestEntitySearch,
    pagination: PaginationParams
  ): Promise<Paginated<TestEntityEntity>> {
    return await this.db.transaction(async (tx) => {
      const filters: SQLWrapper[] = [];

      if (search.parentContextId !== undefined) {
        filters.push(eq(testEntities.parentContextId, search.parentContextId));
      }

      if (search.launchId !== undefined) {
        filters.push(eq(testEntities.launchId, search.launchId));
      }

      const entitiesCount = (
        await tx
          .select({ value: count() })
          .from(testEntities)
          .where(and(...filters))
      )[0]!.value;

      const entities = await tx
        .select()
        .from(testEntities)
        .where(and(...filters))
        .limit(pagination.limit)
        .offset(pagination.offset)
        .orderBy(asc(testEntities.startedTimestamp), asc(testEntities.createdTimestamp));

      return {
        pagination: {
          total: entitiesCount,
          limit: pagination.limit,
          offset: pagination.offset,
        },
        items: entities.map(rowToEntitty),
      };
    });
  }
}

/**
 * Search parameters for finding test entities.
 */
export type TestEntitySearch = {
  parentContextId?: number;
  launchId?: number;
};

/**
 * Test entity entity.
 */
export type TestEntityEntity = {
  launchId: number;
  parentContextId: number | undefined;
  id: number;
  entityType: string;
  title: string;
  createdTimestamp: Date;
  startedTimestamp: Date | undefined;
  finishedTimestamp: Date | undefined;
  statusId: string | undefined;
};

type TestEntityRow = {
  launchId: number;
  parentContextId: number | null;
  id: number;
  title: string;
  createdTimestamp: Date;
  startedTimestamp: Date | null;
  finishedTimestamp: Date | null;
  entityType: string;
  statusId: string | null;
};

const rowToEntitty = (row: TestEntityRow) => {
  return {
    launchId: row.launchId,
    //FIXME for some reason the testEntities.parentContextId is a string in reality, due some bug of drizzle-orm probably
    parentContextId: row.parentContextId ? parseInt(row.parentContextId as unknown as string) : undefined,
    id: row.id,
    entityType: row.entityType,
    title: row.title,
    createdTimestamp: row.createdTimestamp,
    startedTimestamp: row.startedTimestamp ?? undefined,
    finishedTimestamp: row.finishedTimestamp ?? undefined,
    statusId: row.statusId ?? undefined,
  };
};
