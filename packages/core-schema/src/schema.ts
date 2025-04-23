import { sql } from "drizzle-orm";
import { AnyPgColumn, bigint, bigserial, boolean, integer, pgSequence, pgTable, pgView, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { ENTITY_TYPES } from "@total-report/core-schema/constants";

export const testStatusGroups = pgTable("test_status_groups", {
  id: varchar("id", { length: 20 }).primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "string" }).notNull(),
  color: varchar("color", { length: 7 }).notNull(),
});

export const testStatuses = pgTable("test_statuses", {
  id: varchar("id", { length: 256 }).primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "string" }).notNull(),
  groupId: varchar("group_id").references(() => testStatusGroups.id).notNull(),
  color: varchar("color", { length: 7 }).notNull(),
});

export const reports = pgTable("reports", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "date" }).notNull(),
});

export const launches = pgTable("launches", {
  reportId: bigint("report_id", { mode: "number" }).references(() => reports.id).notNull(),
  id: bigserial("id", { mode: "number" }).primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  arguments: text("arguments"),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "date" }).notNull(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "date" }),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "date" }),
  correlationId: uuid("correlation_id").notNull(),
  argumentsHash: uuid("arguments_hash").notNull(),
});

export const testEnititesIdSeq = pgSequence("test_entities_id_seq", { cache: 5 });

export const testContexts = pgTable("test_contexts", {
  launchId: bigint("launch_id", { mode: "number" }).references(() => launches.id).notNull(),
  parentTestContextId: bigint("parent_test_context_id", { mode: 'number' }).references((): AnyPgColumn => testContexts.id),
  //FIXME drizzle-kit@0.26.2 doesn't support variables in the default, change to testEnititesIdSeq.name when it's supported
  id: bigint("id", { mode: "number" }).primaryKey().default(sql`nextval('test_entities_id_seq')`),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "date" }).notNull(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "date" }),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "date" }),
});

export const beforeTests = pgTable("before_tests", {
  launchId: bigint("launch_id", { mode: "number" }).references(() => launches.id).notNull(),
  testContextId: bigint("test_context_id", { mode: 'number' }).references(() => testContexts.id),
  //FIXME drizzle-kit@0.26.2 doesn't support variables in the default, change to testEnititesIdSeq.name when it's supported
  id: bigint("id", { mode: "number" }).primaryKey().default(sql`nextval('test_entities_id_seq')`),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "date" }).notNull(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "date" }),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "date" }),
  statusId: varchar("status_id").references(() => testStatuses.id),
  correlationId: uuid("correlation_id").notNull(),
  argumentsHash: uuid("arguments_hash").notNull(),
});

export const beforeTestArguments = pgTable("before_test_arguments", {
  testId: bigint("test_id", { mode: "number" }).references(() => beforeTests.id).notNull(),
  id: bigserial("id", { mode: "number" }).primaryKey(),
  index: integer("index").notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  type: varchar("type", { length: 256 }).notNull(),
  value: text("value"),
});

export const beforeTestSteps = pgTable("before_test_steps", {
  testId: bigint("test_id", { mode: "number" }).references(() => beforeTests.id).notNull(),
  id: bigserial("id", { mode: "number" }).primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "date" }).notNull(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "date" }),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "date" }),
  isSuccessful: boolean("is_successful"),
  errorMessage: text("error_message"),
});

export const tests = pgTable("tests", {
  launchId: bigint("launch_id", { mode: "number" }).references(() => launches.id).notNull(),
  testContextId: bigint("test_context_id", { mode: 'number' }).references(() => testContexts.id),
  //FIXME drizzle-kit@0.26.2 doesn't support variables in the default, change to testEnititesIdSeq.name when it's supported
  id: bigint("id", { mode: "number" }).primaryKey().default(sql`nextval('test_entities_id_seq')`),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "date" }).notNull(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "date" }),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "date" }),
  statusId: varchar("status_id").references(() => testStatuses.id),
  correlationId: uuid("correlation_id").notNull(),
  argumentsHash: uuid("arguments_hash").notNull(),
});

export const testArguments = pgTable("test_arguments", {
  testId: bigint("test_id", { mode: "number" }).references(() => tests.id).notNull(),
  id: bigserial("id", { mode: "number" }).primaryKey(),
  index: integer("index").notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  type: varchar("type", { length: 256 }).notNull(),
  value: text("value"),
});

export const testSteps = pgTable("test_steps", {
  testId: bigint("test_id", { mode: "number" }).references(() => tests.id).notNull(),
  id: bigserial("id", { mode: "number" }).primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "date" }).notNull(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "date" }),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "date" }),
  isSuccessful: boolean("is_successful"),
  errorMessage: text("error_message"),
});

export const afterTests = pgTable("after_tests", {
  launchId: bigint("launch_id", { mode: "number" }).references(() => launches.id).notNull(),
  testContextId: bigint("test_context_id", { mode: 'number' }).references(() => testContexts.id),
  //FIXME drizzle-kit@0.26.2 doesn't support variables in the default, change to testEnititesIdSeq.name when it's supported
  id: bigint("id", { mode: "number" }).primaryKey().default(sql`nextval('test_entities_id_seq')`),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "date" }).notNull(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "date" }),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "date" }),
  statusId: varchar("status_id").references(() => testStatuses.id),
  correlationId: uuid("correlation_id").notNull(),
  argumentsHash: uuid("arguments_hash").notNull(),
});

export const afterTestArguments = pgTable("after_test_arguments", {
  testId: bigint("test_id", { mode: "number" }).references(() => afterTests.id).notNull(),
  id: bigserial("id", { mode: "number" }).primaryKey(),
  index: integer("index").notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  type: varchar("type", { length: 256 }).notNull(),
  value: text("value"),
});

export const afterTestSteps = pgTable("after_test_steps", {
  testId: bigint("test_id", { mode: "number" }).references(() => afterTests.id).notNull(),
  id: bigserial("id", { mode: "number" }).primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "date" }).notNull(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "date" }),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "date" }),
  isSuccessful: boolean("is_successful"),
  errorMessage: text("error_message"),
});

export const paths = pgTable("paths", {
  testId: bigint("test_id", { mode: "number" }).references(() => tests.id),
  id: bigserial("id", { mode: "number" }).primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "string" }).notNull(),
});

export const testEntities = pgView("test_entities").as((qb) => 
  qb.select({
      launchId: beforeTests.launchId,
      parentContextId: sql<number | null>`${beforeTests.testContextId}`.as("parent_context_id"),
      entityType: sql<string>`${ENTITY_TYPES.BEFORE_TEST}`.as("entity_type"),
      id: beforeTests.id,
      title: beforeTests.title,
      createdTimestamp: beforeTests.createdTimestamp,
      startedTimestamp: beforeTests.startedTimestamp,
      finishedTimestamp: beforeTests.finishedTimestamp,
      statusId: beforeTests.statusId,
      correlationId: beforeTests.correlationId,
      argumentsHash: beforeTests.argumentsHash})
    .from(beforeTests)
  .unionAll(
    qb.select({
        launchId: tests.launchId,
        parentContextId: sql<number | null>`${tests.testContextId}`.as("parent_context_id"),
        entityType: sql<string>`${ENTITY_TYPES.TEST}`.as("entity_type"),
        id: tests.id,
        title: tests.title,
        createdTimestamp: tests.createdTimestamp,
        startedTimestamp: tests.startedTimestamp,
        finishedTimestamp: tests.finishedTimestamp,
        statusId: tests.statusId,
        correlationId: tests.correlationId,
        argumentsHash: tests.argumentsHash})
      .from(tests))
  .unionAll(
    qb.select({
        launchId: afterTests.launchId,
        parentContextId: sql<number | null>`${afterTests.testContextId}`.as("parent_context_id"),
        entityType: sql<string>`${ENTITY_TYPES.AFTER_TEST}`.as("entity_type"),
        id: afterTests.id,
        title: afterTests.title,
        createdTimestamp: afterTests.createdTimestamp,
        startedTimestamp: afterTests.startedTimestamp,
        finishedTimestamp: afterTests.finishedTimestamp,
        statusId: afterTests.statusId,
        correlationId: afterTests.correlationId,
        argumentsHash: afterTests.argumentsHash})
      .from(afterTests)))
