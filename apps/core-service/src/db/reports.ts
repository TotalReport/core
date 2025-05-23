import { launches, reports } from "@total-report/core-schema/schema";
import { and, count, eq, ilike, SQLWrapper } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres/session";
import { PgDatabase } from "drizzle-orm/pg-core/db";
import { Paginated, PaginationParams } from "../db-common/types.js";
import { db as defaultDB } from "../db/setup.js";
import { escapeSqlLikeSpecialChars } from "../utils/sql-utils.js";

export class ReportsDAO {
  db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>>;

  constructor(
    db: PgDatabase<NodePgQueryResultHKT, Record<string, unknown>> = defaultDB
  ) {
    this.db = db;
  }

  createReport = async ({
    title,
  }: CreateReportArgs): Promise<ReportBaseInfo> => {
    return (
      await this.db
        .insert(reports)
        .values({
          title,
          createdTimestamp: new Date(),
        })
        .returning()
    ).at(0)!;
  };

  findReportById = async (id: number): Promise<ReportBaseInfo | undefined> => {
    const found = await this.db.transaction(async (tx) => {
      return await tx.select().from(reports).where(eq(reports.id, id));
    });

    if (found.length === 0) {
      return undefined;
    }
    return found[0];
  };

  findReports = async ({
    search,
    pagination,
  }: FindReportsParams): Promise<Paginated<ReportBaseInfo>> => {
    const filters: SQLWrapper[] = [];

    if (search.titleContains !== undefined) {
      const escapedTitle = escapeSqlLikeSpecialChars(search.titleContains);
      filters.push(ilike(reports.title, `%${escapedTitle}%`));
    }

    const data = await this.db.transaction(async (tx) => {
      const items = await tx
        .select()
        .from(reports)
        .where(and(...filters))
        .limit(pagination.limit)
        .offset(pagination.offset)
        .orderBy(reports.createdTimestamp);

      const total =
        (
          await tx
            .select({ value: count() })
            .from(reports)
            .where(and(...filters))
        ).at(0)?.value ?? 0;

      return {
        items,
        total,
      };
    });

    return {
      pagination: {
        total: data.total,
        limit: pagination.limit,
        offset: pagination.offset,
      },
      items: data.items,
    };
  };

  deleteReportById = async (id: number): Promise<void> => {
    await this.db.transaction(async (tx) => {
      // FIXME: handle launches delete in launches.ts
      await tx.delete(launches).where(eq(launches.reportId, id));
      await tx.delete(reports).where(eq(reports.id, id));
    });
  };
}

type CreateReportArgs = {
  title: string;
};

type ReportBaseInfo = {
  id: number;
  title: string;
  createdTimestamp: Date;
};

export type FindReportsParams = {
  search: ReportsSearch;
  pagination: PaginationParams;
};

/**
 * Search parameters for finding reports.
 */
export type ReportsSearch = {
  titleContains?: string;
};
