import { bigint, bigserial, boolean, json, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const testStatusGroups = pgTable("test_status_groups", {
  id: varchar("id", { length: 4 }).primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "date" }).notNull(),
  color: varchar("color", { length: 7 }).notNull(),
});

export const testStatuses = pgTable("test_statuses", {
  id: varchar("id", { length: 4 }).primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "date" }).notNull(),
  groupId: varchar("group_id").references(() => testStatusGroups.id).notNull(),
  color: varchar("color", { length: 7 }).notNull(),
});

export const launches = pgTable("launches", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  arguments: text("arguments"),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "date" }).notNull(),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "date" }),
});

export const testEntityTypes = pgEnum("test_entity_types", ["beforeTest", "test", "afterTest"]);

export const testEntities = pgTable("test_entities", {
  //TODO here and everywhere investigatge if cascade delete gives performance issues on large datasets
  launchId: bigint("launch_id", { mode: "number" }).references(() => launches.id, { onDelete: "cascade" }).notNull(),
  id: bigserial("id", { mode: "number" }).primaryKey(),
  entityType: testEntityTypes("entity_type").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  arguments: json("arguments").$type<{ name: string, type: string, value: string | null }[]>(),
  externalArguments: json("external_arguments").$type<{ name: string, type: string, value: string | null }[]>(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "date" }).notNull(),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "date" }),
  statusId: varchar("status_id").references(() => testStatuses.id),
  titleHash: uuid("title_hash").notNull(),
  argumentsHash: uuid("arguments_hash").notNull(),
  externalArgumentsHash: uuid("external_arguments_hash").notNull(),
});

export const testEntitySteps = pgTable("test_entity_steps", {
  testId: bigint("test_id", { mode: "number" }).references(() => testEntities.id, { onDelete: "cascade" }).notNull(),
  id: bigserial("id", { mode: "number" }).primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  startedTimestamp: timestamp("started_timestamp", { withTimezone: false, mode: "date" }).notNull(),
  finishedTimestamp: timestamp("finished_timestamp", { withTimezone: false, mode: "date" }),
  isSuccessful: boolean("is_successful"),
  errorMessage: text("error_message"),
  thread: varchar("thread", { length: 256 }),
  process: varchar("process", { length: 256 }),
});

export const users = pgTable("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  email: varchar("email", { length: 256 }).notNull(),
  passwordHash: varchar("password_hash", { length: 256 }),
  name: varchar("name", { length: 256 }),
  isActive: boolean("is_active").notNull(),
  isEmailVerified: boolean("is_email_verified").notNull(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "date" }).notNull(),
  updatedTimestamp: timestamp("updated_timestamp", { withTimezone: false, mode: "date" }),
});

export const authProviders = pgTable("auth_providers", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  userId: bigint("user_id", { mode: "number" }).references(() => users.id).notNull(),
  provider: varchar("provider", { length: 64 }).notNull(),
  providerId: varchar("provider_id", { length: 256 }).notNull(),
  profile: json("profile").$type<Record<string, unknown>>(),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "date" }).notNull(),
  updatedTimestamp: timestamp("updated_timestamp", { withTimezone: false, mode: "date" }),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }).references(() => users.id).notNull(),
  tokenHash: varchar("token_hash", { length: 256 }).notNull(),
  expiresTimestamp: timestamp("expires_timestamp", { withTimezone: false, mode: "date" }),
  createdTimestamp: timestamp("created_timestamp", { withTimezone: false, mode: "date" }).notNull(),
  lastUsedTimestamp: timestamp("last_used_timestamp", { withTimezone: false, mode: "date" }),
});
