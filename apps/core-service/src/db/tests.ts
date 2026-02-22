import {
  launches,
  testEntities,
  testStatuses,
} from "@total-report/core-schema/schema";
import {
  and,
  count,
  countDistinct,
  eq,
  ilike,
  inArray,
  sql,
  SQLWrapper,
} from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { Paginated, PaginationParams } from "../db-common/types.js";
import { TestNotFoundError } from "../errors/errors.js";
import {
  validateTimestampsAndStatus,
  validateTitle,
} from "../validations/validations.js";
import { db as defaultDB } from "./setup.js";

/**
 * Data access object for tests.
 */
export class TestsDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB,
  ) {
    this.db = db;
  }

  /**
   * Create a new test entity.
   *
   * @param {CreateTestArguments} args Arguments for creating a new test entity.
   * @returns Created test entity.
   */
  async create(args: CreateTestArguments): Promise<TestEntity> {
    const result = await this.db.transaction(async (tx) => {
      validate(args);

      const test = await (
        await tx
          .insert(testEntities)
          .values({
            launchId: args.launchId,
            entityType: args.entityType,
            title: args.title,
            arguments: args.arguments,
            externalArguments: args.externalArguments,
            startedTimestamp: args.startedTimestamp,
            finishedTimestamp: args.finishedTimestamp,
            statusId: args.statusId,
            titleHash: args.correlationId,
            argumentsHash: args.argumentsHash,
            externalArgumentsHash: args.externalArgumentsHash,
          })
          .returning()
      ).at(0)!;

      return convertToEntity(test);
    });

    return result;
  }

  /**
   * Find a test entity by id.
   *
   * @param id Id of the test entity.
   * @returns After test entity with the provided id.
   */
  findById(id: number): Promise<TestEntity | undefined> {
    return this.db.transaction(async (tx) => {
      const testRow = await this.db
        .select()
        .from(testEntities)
        .where(eq(testEntities.id, id))
        .execute()
        .then((result) => {
          if (result.length === 0) {
            return undefined;
          }
          return result[0];
        });

      if (testRow == undefined) {
        return undefined;
      }

      return convertToEntity(testRow);
    });
  }

  /**
   * Patch a test entity.
   *
   * @param args Arguments for patching a test entity.
   * @returns Patched test entity.
   */
  patch(args: PatchTest): Promise<TestEntity> {
    return this.db.transaction(async (tx) => {
      const testRow = await this.findRowById(tx, args.id);

      if (testRow == undefined) {
        throw new TestNotFoundError(args.id);
      }

      const expectedRow = applyPatchToTestRow({
        row: testRow,
        patch: takeTestRowUpdateableFields(args),
      });

      validate(expectedRow);

      const updatedTest = (
        await tx
          .update(testEntities)
          .set(args)
          .where(eq(testEntities.id, args.id))
          .returning()
      ).at(0)!;

      return convertToEntity(updatedTest);
    });
  }

  /**
   * Delete a test entity by id.
   *
   * @param id Id of the test entity.
   */
  async deleteById(id: number): Promise<void> {
    await this.db.transaction(async (tx) => {
      await tx.delete(testEntities).where(eq(testEntities.id, id));
    });
  }

  protected findRowById = async (
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>,
    id: number,
  ) => {
    return await db
      .select()
      .from(testEntities)
      .where(eq(testEntities.id, id))
      .execute()
      .then((result) => {
        if (result.length === 0) {
          return undefined;
        }
        return result[0];
      });
  };

  protected insertRow = async (
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>,
    args: CreateTestArguments,
  ) => {
    return;
  };

  /**
   * Find test entities.
   *
   * @param search The search parameters.
   * @param pagination The pagination parameters.
   * @returns The paginated list of test entities.
   */
  async find(
    search: TestEntitySearch,
    pagination: PaginationParams,
  ): Promise<Paginated<TestEntity>> {
    return await this.db.transaction(async (tx) => {
      //TODO rewrite this mess fully to something more readable
      const filters: SQLWrapper[] = [];

      if (search.launchId !== undefined) {
        filters.push(eq(testEntities.launchId, search.launchId));
      }

      if (search.correlationId !== undefined) {
        filters.push(eq(testEntities.titleHash, search.correlationId));
      }

      if (search.argumentsHash !== undefined) {
        filters.push(eq(testEntities.argumentsHash, search.argumentsHash));
      }

      if (search.statusIds !== undefined) {
        filters.push(inArray(testEntities.statusId, search.statusIds));
      }

      if (search.externalArgumentsHash !== undefined) {
        filters.push(
          eq(testEntities.externalArgumentsHash, search.externalArgumentsHash),
        );
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
                  sql` (${testEntities.titleHash}, ${testEntities.argumentsHash}, ${testEntities.externalArgumentsHash})`,
                )
              : count(),
          })
          .from(testEntities)
          .where(and(...filters))
      )[0]!.value;

      const selectItems = tx
        .select({
          launchId: testEntities.launchId,
          id: testEntities.id,
          title: testEntities.title,
          arguments: testEntities.arguments,
          externalArguments: testEntities.externalArguments,
          startedTimestamp: testEntities.startedTimestamp,
          finishedTimestamp: testEntities.finishedTimestamp,
          entityType: testEntities.entityType,
          statusId: testEntities.statusId,
          titleHash: testEntities.titleHash,
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
              id: testEntities.id,
              title: testEntities.title,
              arguments: testEntities.arguments,
              externalArguments: testEntities.externalArguments,
              startedTimestamp: testEntities.startedTimestamp,
              finishedTimestamp: testEntities.finishedTimestamp,
              entityType: testEntities.entityType,
              statusId: testEntities.statusId,
              titleHash: testEntities.titleHash,
              argumentsHash: testEntities.argumentsHash,
              externalArgumentsHash: testEntities.externalArgumentsHash,
              rank: sql`rank() over (partition by ${testEntities.titleHash},${testEntities.argumentsHash},${testEntities.externalArgumentsHash} order by ${testEntities.finishedTimestamp} desc, ${testEntities.id} desc)`.as(
                "rank",
              ),
            })
            .from(testEntities)
            .where(and(...filters))
            .as("t");

          return tx
            .select({
              launchId: subquery.launchId,
              id: subquery.id,
              title: subquery.title,
              arguments: subquery.arguments,
              externalArguments: subquery.externalArguments,
              startedTimestamp: subquery.startedTimestamp,
              finishedTimestamp: subquery.finishedTimestamp,
              entityType: subquery.entityType,
              statusId: subquery.statusId,
              titleHash: subquery.titleHash,
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
  launchId: number | undefined,
) => {
  const testEntitiesWithDuplicationCounter = db
    .$with("test_entities_with_duplication_counter")
    .as(
      db
        .select({
          launchId: testEntities.launchId,
          id: testEntities.id,
          title: testEntities.title,
          startedTimestamp: testEntities.startedTimestamp,
          finishedTimestamp: testEntities.finishedTimestamp,
          entityType: testEntities.entityType,
          statusId: testEntities.statusId,
          titleHash: testEntities.titleHash,
          argumentsHash: testEntities.argumentsHash,
          externalArgumentsHash: testEntities.externalArgumentsHash,
          repeatCounter:
            sql`ROW_NUMBER() over (partition by ${testEntities.entityType}, ${testEntities.externalArgumentsHash}, ${testEntities.titleHash}, ${testEntities.argumentsHash} order by ${testEntities.finishedTimestamp} desc, ${testEntities.id} desc)`.as(
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
        id: testEntities.id,
        title: testEntities.title,
        startedTimestamp: testEntities.startedTimestamp,
        finishedTimestamp: testEntities.finishedTimestamp,
        entityType: testEntities.entityType,
        statusId: testEntities.statusId,
        titleHash: testEntities.titleHash,
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

export type CreateTestArguments = {
  launchId: number;
  title: string;
  entityType: "beforeTest" | "test" | "afterTest";
  startedTimestamp: Date;
  finishedTimestamp?: Date;
  statusId?: string;
  arguments?: {
    name: string;
    type: string;
    value: string | null;
  }[];
  externalArguments?: {
    name: string;
    type: string;
    value: string | null;
  }[];
  correlationId: string;
  argumentsHash: string;
  externalArgumentsHash: string;
};

export type TestEntity = ReplaceNullWithUndefined<TestsRow>;

export type PatchTest = {
  id: number;
  title?: string;
  startedTimestamp?: Date;
  finishedTimestamp?: Date | null;
  statusId?: string | null;
};

const validate = (args: TestEntity | TestsRow | CreateTestArguments) => {
  validateTitle(args);
  validateTimestampsAndStatus(args);
};

const convertToEntity = (testRow: TestsRow): TestEntity => {
  return {
    launchId: testRow.launchId,
    id: testRow.id,
    entityType: testRow.entityType,
    title: testRow.title,
    startedTimestamp: testRow.startedTimestamp,
    finishedTimestamp: testRow.finishedTimestamp ?? undefined,
    statusId: testRow.statusId ?? undefined,
    arguments: testRow.arguments ?? undefined,
    externalArguments: testRow.externalArguments ?? undefined,
    titleHash: testRow.titleHash,
    argumentsHash: testRow.argumentsHash,
    externalArgumentsHash: testRow.externalArgumentsHash,
  };
};

type TestsTable = typeof testEntities;

type TestsRow = TestsTable["$inferSelect"];

type NoNullField<T> = { [P in keyof T]: NonNullable<T[P]> };

type ReplaceNullWithUndefined<T extends Object> = {
  [k in keyof T]: null extends T[k] ? Exclude<T[k], null> | undefined : T[k];
};

export const takeTestRowUpdateableFields = (
  args: PatchTest,
): TestRowUpdateableFields => {
  return {
    title: args.title,
    startedTimestamp: args.startedTimestamp,
    finishedTimestamp: args.finishedTimestamp,
    statusId: args.statusId,
  };
};

export const applyPatchToTestRow = (args: {
  row: TestsRow;
  patch: TestRowUpdateableFields;
}): TestsRow => {
  return {
    launchId: args.row.launchId,
    id: args.row.id,
    entityType: args.row.entityType,
    title: firstNotUndefined(args.patch.title, args.row.title),
    arguments: args.row.arguments,
    externalArguments: args.row.externalArguments,
    startedTimestamp: firstNotUndefined(
      args.patch.startedTimestamp,
      args.row.startedTimestamp,
    ),
    finishedTimestamp: firstNotUndefined(
      args.patch.finishedTimestamp,
      args.row.finishedTimestamp,
    ),
    statusId: firstNotUndefined(args.patch.statusId, args.row.statusId),
    titleHash: args.row.titleHash,
    argumentsHash: args.row.argumentsHash,
    externalArgumentsHash: args.row.externalArgumentsHash,
  };
};

const firstNotUndefined = <T>(
  arg1: NonUndefined<T> | undefined,
  arg2: NonUndefined<T>,
): NonUndefined<T> => {
  return arg1 === undefined ? arg2 : arg1;
};

export type NonUndefined<T> = T extends undefined ? never : T;

export type TestRowUpdateableFields = {
  title: string | undefined;
  startedTimestamp: Date | undefined;
  finishedTimestamp: Date | null | undefined;
  statusId: string | null | undefined;
};

export type TestStepRowUpdateableFields = {
  title: string | undefined;
  createdTimestamp: Date | undefined;
  startedTimestamp: Date | null | undefined;
  finishedTimestamp: Date | null | undefined;
  isSuccessful: boolean | null | undefined;
  errorMessage: string | null | undefined;
};

export type Override<
  Type,
  NewType extends { [key in keyof Type]?: NewType[key] },
> = Omit<Type, keyof NewType> & NewType;

/**
 * Search parameters for finding test entities.
 */
export type TestEntitySearch = {
  entityTypes?: ("beforeTest" | "test" | "afterTest")[];
  launchId?: number;
  correlationId?: string;
  argumentsHash?: string;
  statusIds?: string[];
  externalArgumentsHash?: string;
  distinct?: boolean;
  titleContains?: string;
};

type TestEntityRow = {
  launchId: number;
  id: number;
  title: string;
  arguments: {
    name: string;
    type: string;
    value: string | null;
  }[] | null;
  externalArguments: {
    name: string;
    type: string;
    value: string | null;
  }[] | null;
  startedTimestamp: Date;
  finishedTimestamp: Date | null;
  entityType: "beforeTest" | "test" | "afterTest";
  statusId: string | null;
  titleHash: string;
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
    id: row.id,
    entityType: row.entityType,
    title: row.title,
    arguments: row.arguments ?? undefined,
    externalArguments: row.externalArguments ?? undefined,
    startedTimestamp: row.startedTimestamp,
    finishedTimestamp: row.finishedTimestamp ?? undefined,
    statusId: row.statusId ?? undefined,
    titleHash: row.titleHash,
    argumentsHash: row.argumentsHash,
    externalArgumentsHash: row.externalArgumentsHash,
  };
};
