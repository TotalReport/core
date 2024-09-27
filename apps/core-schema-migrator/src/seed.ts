import {
  DEFAULT_TEST_STATUSES,
  TEST_STATUS_GROUPS,
} from "@total-report/core-schema/constants";
import {
  testStatusGroups,
  testStatuses,
} from "@total-report/core-schema/schema";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const { Client } = pg;

const seed = async (url: string) => {
  const client = new Client({
    connectionString: url,
  });
  await client.connect();
  const db = drizzle(client);

  console.log("Seeding test status groups and statuses.");
  await db
    .insert(testStatusGroups)
    .values([
      {
        ...TEST_STATUS_GROUPS.SUCCESS_GROUP,
        createdTimestamp: new Date().toISOString(),
      },
      {
        ...TEST_STATUS_GROUPS.PRODUCT_BUG_GROUP,
        createdTimestamp: new Date().toISOString(),
      },
      {
        ...TEST_STATUS_GROUPS.AUTOMATION_BUG_GROUP,
        createdTimestamp: new Date().toISOString(),
      },
      {
        ...TEST_STATUS_GROUPS.SYSTEM_ISSUE_GROUP,
        createdTimestamp: new Date().toISOString(),
      },
      {
        ...TEST_STATUS_GROUPS.NO_DEFECT_GROUP,
        createdTimestamp: new Date().toISOString(),
      },
      {
        ...TEST_STATUS_GROUPS.TO_INVESTIGATE_GROUP,
        createdTimestamp: new Date().toISOString(),
      },
    ])
    .onConflictDoUpdate({
      target: testStatusGroups.id,
      set: { title: sql`excluded.title` },
    });

  console.log("Seeding test statuses groups is finished.");

  await db
    .insert(testStatuses)
    .values([
      {
        ...DEFAULT_TEST_STATUSES.SUCCESS,
        createdTimestamp: new Date().toISOString(),
      },
      {
        ...DEFAULT_TEST_STATUSES.PRODUCT_BUG,
        createdTimestamp: new Date().toISOString(),
      },
      {
        ...DEFAULT_TEST_STATUSES.AUTOMATION_BUG,
        createdTimestamp: new Date().toISOString(),
      },
      {
        ...DEFAULT_TEST_STATUSES.SYSTEM_ISSUE,
        createdTimestamp: new Date().toISOString(),
      },
      {
        ...DEFAULT_TEST_STATUSES.NO_DEFECT,
        createdTimestamp: new Date().toISOString(),
      },
      {
        ...DEFAULT_TEST_STATUSES.TO_INVESTIGATE,
        createdTimestamp: new Date().toISOString(),
      },
    ])
    .onConflictDoUpdate({
      target: testStatuses.id,
      set: { title: sql`excluded.title` },
    });

  console.log("Seeding test statuses is finished.");
};

await seed(process.env["DB_URL"]!);

process.exit(0);
