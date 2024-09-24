import { relations } from "drizzle-orm";
import { pgTable, varchar, uuid, timestamp, text, integer, primaryKey, AnyPgColumn, bigserial, bigint } from "drizzle-orm/pg-core";

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
  id: uuid("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "string" }).notNull(),
});

export const launches = pgTable("launches", {
  id: uuid("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "string" }).notNull(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "string" }),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "string" }),
  reportId: uuid("report_id").notNull().references(() => reports.id)
});

export const testContexts = pgTable("test_contexts", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "string" }).notNull(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "string" }),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "string" }),
  launchId: uuid("launch_id").references(() => launches.id).notNull(),
  parentTestContextId: bigint("parent_test_context_id", { mode: 'number' }).references((): AnyPgColumn => testContexts.id),
});

export const beforeTests = pgTable("before_tests", {
  id: uuid("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "string" }).notNull(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "string" }),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "string" }),
  launchId: uuid("launch_id").references(() => launches.id).notNull(),
  testContextId: bigint("test_context_id", { mode: 'number' }).references(() => testContexts.id),
  statusId: varchar("status_id").references(() => testStatuses.id),
  argumentsHash: uuid("arguments_hash"),
});

export const beforeTestArguments = pgTable("before_test_arguments", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  index: integer("index"),
  type: varchar("type", { length: 256 }).notNull(),
  value: text("value"),
  beforeTestId: uuid("before_test_id").references(() => beforeTests.id),
});

export const beforeTestSteps = pgTable("before_test_steps", {
  id: uuid("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "string" }).notNull(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "string" }),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "string" }),
  beforeTestId: uuid("before_test_id").references(() => beforeTests.id)
});

// export const beforeTestsRelations = relations(beforeTests, ({ many }) => ({
//   beforeTestsToTests: many(beforeTestsToTests),
// }));

// export const afterTestsRelations = relations(beforeTests, ({ many }) => ({
//   afterTestsToTests: many(afterTestsToTests),
// }));

export const tests = pgTable("tests", {
  id: uuid("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "string" }).notNull(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "string" }),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "string" }),
  launchId: uuid("launch_id").references(() => launches.id).notNull(),
  testContextId: bigint("test_context_id", { mode: 'number' }).references(() => testContexts.id),
  statusId: varchar("status_id").references(() => testStatuses.id),
  argumentsHash: uuid("arguments_hash"),
});

export const testArguments = pgTable("test_arguments", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  index: integer("index"),
  type: varchar("type", { length: 256 }).notNull(),
  value: text("value"),
  testId: uuid("test_id").references(() => tests.id),
});

export const testSteps = pgTable("test_steps", {
  id: uuid("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "string" }).notNull(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "string" }),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "string" }),
  testId: uuid("test_id").references(() => tests.id)
});

export const afterTests = pgTable("after_tests", {
  id: uuid("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "string" }).notNull(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "string" }),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "string" }),
  launchId: uuid("launch_id").references(() => launches.id).notNull(),
  testContextId: bigint("test_context_id", { mode: 'number' }).references(() => testContexts.id),
  statusId: varchar("status_id").references(() => testStatuses.id),
  argumentsHash: uuid("arguments_hash").notNull(),
});

export const afterTestArguments = pgTable("after_test_arguments", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  index: integer("index"),
  type: varchar("type", { length: 256 }).notNull(),
  value: text("value"),
  beforeTestId: uuid("before_test_id").references(() => afterTests.id),
});

// export const testsRelations = relations(tests, ({ many }) => ({
//   beforeToTests: many(beforeTestsToTests),
//   afterToTests: many(afterTestsToTests),
// }));

// export const beforeTestsToTests = pgTable("before_tests_to_tests", {
//     beforeTestId: uuid("before_test_id").notNull().references(() => beforeTests.id),
//     testId: uuid("test_id").notNull().references(() => tests.id),
//   },
//   (t) => ({
//     pk: primaryKey({ columns: [t.beforeTestId, t.testId] }),
//   })
// );

// export const afterTestsToTests = pgTable("after_tests_to_tests", {
//     afterTestId: uuid("after_test_id").notNull().references(() => afterTests.id),
//     testId: uuid("test_id").notNull().references(() => tests.id),
//   },
//   (t) => ({
//     pk: primaryKey({ columns: [t.afterTestId, t.testId] }),
//   })
// );

// export const beforeTestsToTestsRelations = relations(beforeTestsToTests, ({ one }) => ({
//   beforeTest: one(beforeTests, {
//     fields: [beforeTestsToTests.beforeTestId],
//     references: [beforeTests.id],
//   }),
//   test: one(tests, {
//     fields: [beforeTestsToTests.testId],
//     references: [tests.id],
//   }),
// }));

// export const afterTestsToTestsRelations = relations(afterTestsToTests, ({ one }) => ({
//   afterTest: one(afterTests, {
//     fields: [afterTestsToTests.afterTestId],
//     references: [afterTests.id],
//   }),
//   test: one(tests, {
//     fields: [afterTestsToTests.testId],
//     references: [tests.id],
//   }),
// }));

export const afterTestSteps = pgTable("after_test_steps", {
  id: uuid("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "string" }).notNull(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "string" }),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "string" }),
  afterTestId: uuid("after_test_id").references(() => afterTests.id)
});

export const paths = pgTable("paths", {
  id: uuid("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "string" }).notNull(),
  testId: uuid("test_id").references(() => tests.id)
});
