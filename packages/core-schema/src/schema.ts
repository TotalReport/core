import { AnyPgColumn, bigint, bigserial, boolean, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const testStatusGroups = pgTable("test_status_groups", {
  id: varchar("id", { length: 20 }).primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "string" }).notNull(),
});

export const testStatuses = pgTable("test_statuses", {
  id: varchar("id", { length: 256 }).primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "string" }).notNull(),
  groupId: varchar("group_id").references(() => testStatusGroups.id).notNull()
});

export const reports = pgTable("reports", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "string" }).notNull(),
});

export const launches = pgTable("launches", {
  reportId: bigint("report_id", { mode: "number" }).references(() => reports.id).notNull(),
  id: bigserial("id", { mode: "number" }).primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "date" }).notNull(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "date" }),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "date" })
});

export const testContexts = pgTable("test_contexts", {
  launchId: bigint("launch_id", { mode: "number" }).references(() => launches.id).notNull(),
  parentTestContextId: bigint("parent_test_context_id", { mode: 'number' }).references((): AnyPgColumn => testContexts.id),
  id: bigserial("id", { mode: "number" }).primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "date" }).notNull(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "date" }),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "date" }),
});

export const beforeTests = pgTable("before_tests", {
  launchId: bigint("launch_id", { mode: "number" }).references(() => launches.id).notNull(),
  testContextId: bigint("test_context_id", { mode: 'number' }).references(() => testContexts.id),
  id: bigserial("id", { mode: "number" }).primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "date" }).notNull(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "date" }),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "date" }),
  statusId: varchar("status_id").references(() => testStatuses.id),
  argumentsHash: uuid("arguments_hash"),
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
  id: bigserial("id", { mode: "number" }).primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "date" }).notNull(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "date" }),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "date" }),
  statusId: varchar("status_id").references(() => testStatuses.id),
  argumentsHash: uuid("arguments_hash"),
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
  id: bigserial("id", { mode: "number" }).primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "date" }).notNull(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "date" }),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "date" }),
  statusId: varchar("status_id").references(() => testStatuses.id),
  argumentsHash: uuid("arguments_hash"),
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
