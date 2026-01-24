import {
  launches,
  testEntities,
  testStatuses
} from "@total-report/core-schema/schema";
import {
  aliasedTable,
  and,
  count,
  countDistinct,
  eq,
  ilike,
  inArray,
  sql,
  SQLWrapper,
} from "drizzle-orm";
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
      //TODO rewrite this mess fully to something more readable
      const filters: SQLWrapper[] = [];

      if (search.contextId !== undefined) {
        filters.push(eq(testEntities.parentContextId, search.contextId));
      }

      if (search.launchId !== undefined) {
        filters.push(eq(testEntities.launchId, search.launchId));
      }

      if (search.correlationId !== undefined) {
        filters.push(eq(testEntities.correlationId, search.correlationId));
      }

      if (search.argumentsHash !== undefined) {
        filters.push(eq(testEntities.argumentsHash, search.argumentsHash));
      }

      if (search.statusIds !== undefined) {
        filters.push(inArray(testEntities.statusId, search.statusIds));
      }

      if (search.externalArgumentsHash !== undefined) {
        filters.push(eq(testEntities.externalArgumentsHash, search.externalArgumentsHash));
      }

      if (search.entityTypes !== undefined) {
        filters.push(inArray(testEntities.entityType, search.entityTypes));
      }

      if (search.titleContains !== undefined) {
        const escapedTitle = search.titleContains
          .replace(/%/g, "\\%")
          .replace(/_/g, "\\_");
        filters.push(ilike(testEntities.title, `%${escapedTitle}%`));
      }

      const entitiesCount = (
        await tx
          .select({
            value: search.distinct
              ? countDistinct(
                  sql` (${testEntities.correlationId}, ${testEntities.argumentsHash}, ${testEntities.externalArgumentsHash})`,
                )
              : count(),
          })
          .from(testEntities)
          .where(and(...filters))
      )[0]!.value;

      const selectItems = tx
        .select({
          launchId: testEntities.launchId,
          contextId: testEntities.parentContextId,
          id: testEntities.id,
          title: testEntities.title,
          createdTimestamp: testEntities.createdTimestamp,
          startedTimestamp: testEntities.startedTimestamp,
          finishedTimestamp: testEntities.finishedTimestamp,
          entityType: testEntities.entityType,
          statusId: testEntities.statusId,
          correlationId: testEntities.correlationId,
          argumentsHash: testEntities.argumentsHash,
          externalArgumentsHash: testEntities.externalArgumentsHash,
        })
        .from(testEntities)
        .where(and(...filters));

      const queryItems = () => {
        if (search.distinct == true) {
          const subquery = tx
            .select({
              launchId: testEntities.launchId,
              contextId: testEntities.parentContextId,
              id: testEntities.id,
              title: testEntities.title,
              createdTimestamp: testEntities.createdTimestamp,
              startedTimestamp: testEntities.startedTimestamp,
              finishedTimestamp: testEntities.finishedTimestamp,
              entityType: testEntities.entityType,
              statusId: testEntities.statusId,
              correlationId: testEntities.correlationId,
              argumentsHash: testEntities.argumentsHash,
              externalArgumentsHash: testEntities.externalArgumentsHash,
              rank: sql`rank() over (partition by ${testEntities.correlationId},${testEntities.argumentsHash},${testEntities.externalArgumentsHash} order by ${testEntities.finishedTimestamp} desc, ${testEntities.id} desc)`.as(
                "rank",
              ),
            })
            .from(testEntities)
            .where(and(...filters))
            .as("t");

          return tx
            .select({
              launchId: subquery.launchId,
              contextId: subquery.contextId,
              id: subquery.id,
              title: subquery.title,
              createdTimestamp: subquery.createdTimestamp,
              startedTimestamp: subquery.startedTimestamp,
              finishedTimestamp: subquery.finishedTimestamp,
              entityType: subquery.entityType,
              statusId: subquery.statusId,
              correlationId: subquery.correlationId,
              argumentsHash: subquery.argumentsHash,
              externalArgumentsHash: subquery.externalArgumentsHash,
            })
            .from(subquery)
            .where(eq(subquery.rank, 1))
            .limit(pagination.limit)
            .offset(pagination.offset);
        } else {
          return selectItems.limit(pagination.limit).offset(pagination.offset);
        }
      };

      const entities = await queryItems();

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

  async countsByStatuses(params: CountsByStatusesFilter) {
    const testEntitiesFiltered =
      params.distinct === true
        ? this.db
            .$with("test_entities_filtered")
            .as(distinctFilterTestEntities(this.db, params.launchId))
        : this.db
            .$with("test_entities_filtered")
            .as(filterTestEntities(this.db, params.launchId));

    const result = await this.db
      .with(testEntitiesFiltered)
      .select({
        entityType: testEntitiesFiltered.entityType,
        statusGroupId: testStatuses.groupId,
        statusId: testEntitiesFiltered.statusId,
        count: count(),
      })
      .from(testEntitiesFiltered)
      .leftJoin(
        testStatuses,
        eq(testEntitiesFiltered.statusId, testStatuses.id),
      )
      .groupBy(
        testEntitiesFiltered.entityType,
        testStatuses.groupId,
        testEntitiesFiltered.statusId,
      )
      .execute();

    return result;
  }
}

const distinctFilterTestEntities = (
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>,
  launchId: number | undefined
) => {
  const testEntitiesWithDuplicationCounter = db
    .$with("test_entities_with_duplication_counter")
    .as(
      db
        .select({
          launchId: testEntities.launchId,
          contextId: testEntities.parentContextId,
          id: testEntities.id,
          title: testEntities.title,
          createdTimestamp: testEntities.createdTimestamp,
          startedTimestamp: testEntities.startedTimestamp,
          finishedTimestamp: testEntities.finishedTimestamp,
          entityType: testEntities.entityType,
          statusId: testEntities.statusId,
          correlationId: testEntities.correlationId,
          argumentsHash: testEntities.argumentsHash,
          externalArgumentsHash: testEntities.externalArgumentsHash,
          repeatCounter:
            sql`ROW_NUMBER() over (partition by ${testEntities.entityType}, ${testEntities.externalArgumentsHash}, ${testEntities.correlationId}, ${testEntities.argumentsHash} order by ${testEntities.finishedTimestamp} desc, ${testEntities.id} desc)`.as(
              "repeat_counter",
            ),
        })
        .from(testEntities)
        .innerJoin(launches, eq(testEntities.launchId, launches.id))
        .where(
          launchId == undefined
            ? undefined
            : eq(testEntities.launchId, launchId),
        ),
    );

  return db
    .with(testEntitiesWithDuplicationCounter)
    .select()
    .from(testEntitiesWithDuplicationCounter)
    .where(eq(testEntitiesWithDuplicationCounter.repeatCounter, 1));
};

const filterTestEntities = (
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>,
  launchId: number | undefined,
) => {
  return (
    db
      .select({
        launchId: testEntities.launchId,
        contextId: testEntities.parentContextId,
        id: testEntities.id,
        title: testEntities.title,
        createdTimestamp: testEntities.createdTimestamp,
        startedTimestamp: testEntities.startedTimestamp,
        finishedTimestamp: testEntities.finishedTimestamp,
        entityType: testEntities.entityType,
        statusId: testEntities.statusId,
        correlationId: testEntities.correlationId,
        argumentsHash: testEntities.argumentsHash,
        externalArgumentsHash: testEntities.externalArgumentsHash,
      })
      .from(testEntities)
      //TODO: don't need join if reportId is not defined
      .innerJoin(launches, eq(testEntities.launchId, launches.id))
      .where(
        launchId == undefined ? undefined : eq(testEntities.launchId, launchId),
      )
  );
};

/**
 * Search parameters for finding test entities.
 */
export type TestEntitySearch = {
  entityTypes?: string[];
  launchId?: number;
  contextId?: number;
  correlationId?: string;
  argumentsHash?: string;
  statusIds?: string[];
  externalArgumentsHash?: string;
  distinct?: boolean;
  titleContains?: string;
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
  correlationId: string;
  argumentsHash: string;
  externalArgumentsHash: string;
};

type TestEntityRow = {
  launchId: number;
  contextId: number | null;
  id: number;
  title: string;
  createdTimestamp: Date;
  startedTimestamp: Date | null;
  finishedTimestamp: Date | null;
  entityType: string;
  statusId: string | null;
  correlationId: string;
  argumentsHash: string;
  externalArgumentsHash: string;
};

type CountsByStatusesFilter = {
  launchId?: number;
  distinct: boolean;
};

const rowToEntitty = (row: TestEntityRow) => {
  return {
    launchId: row.launchId,
    //FIXME for some reason the testEntities.parentContextId is a string in reality, due some bug of drizzle-orm probably
    parentContextId: row.contextId
      ? parseInt(row.contextId as unknown as string)
      : undefined,
    id: row.id,
    entityType: row.entityType,
    title: row.title,
    createdTimestamp: row.createdTimestamp,
    startedTimestamp: row.startedTimestamp ?? undefined,
    finishedTimestamp: row.finishedTimestamp ?? undefined,
    statusId: row.statusId ?? undefined,
    correlationId: row.correlationId,
    argumentsHash: row.argumentsHash,
    externalArgumentsHash: row.externalArgumentsHash,
  };
};
