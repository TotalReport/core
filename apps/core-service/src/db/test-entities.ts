import {
  launches,
  reports,
  testEntities,
  testStatuses,
} from "@total-report/core-schema/schema";
import {
  inArray,
  and,
  asc,
  count,
  eq,
  SQLWrapper,
  countDistinct,
  sql,
  max,
  aliasedTable,
  ilike,
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

      if (search.entityTypes !== undefined) {
        filters.push(inArray(testEntities.entityType, search.entityTypes));
      }

      if (search.titleContains !== undefined) {
        const escapedTitle = search.titleContains
          .replace(/%/g, "\\%")
          .replace(/_/g, "\\_");
        filters.push(ilike(testEntities.title, `%${escapedTitle}%`));
      }

      const entitiesCount =
        search.reportId != undefined
          ? (
              await tx
                .select({
                  value: search.distinct
                    ? countDistinct(
                        // FIXME: Is it a typo? Should it be `testEntities` instead of `launches`?
                        sql` (${launches.correlationId},${launches.argumentsHash})`
                      )
                    : count(),
                })
                .from(testEntities)
                .innerJoin(
                  launches,
                  and(
                    eq(testEntities.launchId, launches.id),
                    eq(launches.reportId, search.reportId)
                  )
                )
                .where(and(...filters))
            )[0]!.value
          : (
              await tx
                .select({
                  value: search.distinct
                    ? countDistinct(
                        sql` (${testEntities.correlationId},${testEntities.argumentsHash})`
                      )
                    : count(),
                })
                .from(testEntities)
                .where(and(...filters))
            )[0]!.value;

      const launchesAlias = aliasedTable(launches, "l");

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
        })
        .from(testEntities)
        .where(and(...filters));

      const queryItems = () => {
        if (search.distinct == true) {
          const subquery = (
            search.reportId != undefined
              ? tx
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
                    rank: sql`rank() over (partition by ${testEntities.correlationId},${testEntities.argumentsHash} order by ${testEntities.finishedTimestamp} desc, ${testEntities.id} desc)`.as(
                      "rank"
                    ),
                  })
                  .from(testEntities)
                  .innerJoin(
                    launchesAlias,
                    and(
                      eq(testEntities.launchId, launchesAlias.id),
                      eq(launchesAlias.reportId, search.reportId!)
                    )
                  )
                  .where(and(...filters))
              : tx
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
                    rank: sql`rank() over (partition by ${testEntities.correlationId},${testEntities.argumentsHash} order by ${testEntities.finishedTimestamp} desc, ${testEntities.id} desc)`.as(
                      "rank"
                    ),
                  })
                  .from(testEntities)
                  .where(and(...filters))
          ).as("t");

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
            })
            .from(subquery)
            .where(eq(subquery.rank, 1))
            .limit(pagination.limit)
            .offset(pagination.offset);
        } else {
          if (search.reportId != undefined)
            return selectItems
              .innerJoin(
                launchesAlias,
                and(
                  eq(testEntities.launchId, launchesAlias.id),
                  eq(launchesAlias.reportId, search.reportId!)
                )
              )
              .limit(pagination.limit)
              .offset(pagination.offset);
          else {
            return selectItems
              .limit(pagination.limit)
              .offset(pagination.offset);
          }
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
            .as(distinctFilterTestEntities(this.db, params.reportId, params.launchId))
        : this.db
            .$with("test_entities_filtered")
            .as(filterTestEntities(this.db, params.reportId, params.launchId));

    const result = await this.db
      .with(testEntitiesFiltered)
      .select({
        entityType: testEntitiesFiltered.entityType,
        statusId: testEntitiesFiltered.statusId,
        count: count(),
      })
      .from(testEntitiesFiltered)
      .groupBy(testEntitiesFiltered.entityType, testEntitiesFiltered.statusId)
      .execute();

    return result;
  }
}

const distinctFilterTestEntities = (
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>,
  reportId: number | undefined,
  launchId: number | undefined
) => {
  const testEntitiesWithDuplicationCounter = db
    .$with("test_entities_with_duplication_counter")
    .as(
      db
        .select({
          reportId: launches.reportId,
          launchId: testEntities.launchId,
          contextId: testEntities.parentContextId,
          id: testEntities.id,
          title: testEntities.title,
          createdTimestamp: testEntities.createdTimestamp,
          startedTimestamp: testEntities.startedTimestamp,
          finishedTimestamp: testEntities.finishedTimestamp,
          entityType: testEntities.entityType,
          statusId: testEntities.statusId,
          //TODO: are this fields really needed?
          launchCorrelationId: sql<string>`${launches.correlationId}`.as(
            "launch_correlation_id"
          ),
          launchArgumentsHash: sql<string>`${launches.argumentsHash}`.as(
            "launch_arguments_hash"
          ),
          correlationId: testEntities.correlationId,
          argumentsHash: testEntities.argumentsHash,
          repeatCounter:
            sql`ROW_NUMBER() over (partition by ${testEntities.entityType}, ${launches.correlationId}, ${launches.argumentsHash}, ${testEntities.correlationId}, ${testEntities.argumentsHash} order by ${testEntities.finishedTimestamp} desc, ${testEntities.id} desc)`.as(
              "repeat_counter"
            ),
        })
        .from(testEntities)
        .innerJoin(
          launches,
          and(
            eq(testEntities.launchId, launches.id),
            reportId != undefined ? eq(launches.reportId, reportId) : undefined
          )
        )
        .where(
          launchId == undefined
            ? undefined
            : eq(testEntities.launchId, launchId)
        )
    );

  return db
    .with(testEntitiesWithDuplicationCounter)
    .select()
    .from(testEntitiesWithDuplicationCounter)
    .where(eq(testEntitiesWithDuplicationCounter.repeatCounter, 1));
};

const filterTestEntities = (
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>,
  reportId: number | undefined,
  launchId: number | undefined
) => {
  return (
    db
      .select({
        reportId: launches.reportId,
        launchId: testEntities.launchId,
        contextId: testEntities.parentContextId,
        id: testEntities.id,
        title: testEntities.title,
        createdTimestamp: testEntities.createdTimestamp,
        startedTimestamp: testEntities.startedTimestamp,
        finishedTimestamp: testEntities.finishedTimestamp,
        entityType: testEntities.entityType,
        statusId: testEntities.statusId,
        //TODO: are this fields really needed?
        launchCorrelationId: sql<string>`${launches.correlationId}`.as(
          "launch_correlation_id"
        ),
        launchArgumentsHash: sql<string>`${launches.argumentsHash}`.as(
          "launch_arguments_hash"
        ),
        correlationId: testEntities.correlationId,
        argumentsHash: testEntities.argumentsHash,
      })
      .from(testEntities)
      //TODO: don't need join if reportId is not defined
      .innerJoin(
        launches,
        and(
          eq(testEntities.launchId, launches.id),
          reportId != undefined ? eq(launches.reportId, reportId) : undefined
        )
      )
      .where(
        launchId == undefined ? undefined : eq(testEntities.launchId, launchId)
      )
  );
};

/**
 * Search parameters for finding test entities.
 */
export type TestEntitySearch = {
  entityTypes?: string[];
  reportId?: number;
  launchId?: number;
  contextId?: number;
  correlationId?: string;
  argumentsHash?: string;
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
};

type CountsByStatusesFilter = {
  reportId?: number;
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
  };
};
