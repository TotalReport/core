CREATE SEQUENCE "public"."test_entities_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 5;--> statement-breakpoint
CREATE TABLE "after_test_arguments" (
	"test_id" bigint NOT NULL,
	"id" bigserial PRIMARY KEY NOT NULL,
	"index" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"type" varchar(256) NOT NULL,
	"value" text
);
--> statement-breakpoint
CREATE TABLE "after_test_steps" (
	"test_id" bigint NOT NULL,
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp,
	"is_successful" boolean,
	"error_message" text
);
--> statement-breakpoint
CREATE TABLE "after_tests" (
	"launch_id" bigint NOT NULL,
	"test_context_id" bigint,
	"id" bigint PRIMARY KEY DEFAULT nextval('test_entities_id_seq') NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp,
	"status_id" varchar,
	"correlation_id" uuid NOT NULL,
	"arguments_hash" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "before_test_arguments" (
	"test_id" bigint NOT NULL,
	"id" bigserial PRIMARY KEY NOT NULL,
	"index" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"type" varchar(256) NOT NULL,
	"value" text
);
--> statement-breakpoint
CREATE TABLE "before_test_steps" (
	"test_id" bigint NOT NULL,
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp,
	"is_successful" boolean,
	"error_message" text
);
--> statement-breakpoint
CREATE TABLE "before_tests" (
	"launch_id" bigint NOT NULL,
	"test_context_id" bigint,
	"id" bigint PRIMARY KEY DEFAULT nextval('test_entities_id_seq') NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp,
	"status_id" varchar,
	"correlation_id" uuid NOT NULL,
	"arguments_hash" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "launches" (
	"report_id" bigint NOT NULL,
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"arguments" text,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp,
	"correlation_id" uuid NOT NULL,
	"arguments_hash" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paths" (
	"test_id" bigint,
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_arguments" (
	"test_id" bigint NOT NULL,
	"id" bigserial PRIMARY KEY NOT NULL,
	"index" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"type" varchar(256) NOT NULL,
	"value" text
);
--> statement-breakpoint
CREATE TABLE "test_contexts" (
	"launch_id" bigint NOT NULL,
	"parent_test_context_id" bigint,
	"id" bigint PRIMARY KEY DEFAULT nextval('test_entities_id_seq') NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp
);
--> statement-breakpoint
CREATE TABLE "test_status_groups" (
	"id" varchar(20) PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_statuses" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"group_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_steps" (
	"test_id" bigint NOT NULL,
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp,
	"is_successful" boolean,
	"error_message" text
);
--> statement-breakpoint
CREATE TABLE "tests" (
	"launch_id" bigint NOT NULL,
	"test_context_id" bigint,
	"id" bigint PRIMARY KEY DEFAULT nextval('test_entities_id_seq') NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp,
	"status_id" varchar,
	"correlation_id" uuid NOT NULL,
	"arguments_hash" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "after_test_arguments" ADD CONSTRAINT "after_test_arguments_test_id_after_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."after_tests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "after_test_steps" ADD CONSTRAINT "after_test_steps_test_id_after_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."after_tests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "after_tests" ADD CONSTRAINT "after_tests_launch_id_launches_id_fk" FOREIGN KEY ("launch_id") REFERENCES "public"."launches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "after_tests" ADD CONSTRAINT "after_tests_test_context_id_test_contexts_id_fk" FOREIGN KEY ("test_context_id") REFERENCES "public"."test_contexts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "after_tests" ADD CONSTRAINT "after_tests_status_id_test_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."test_statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "before_test_arguments" ADD CONSTRAINT "before_test_arguments_test_id_before_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."before_tests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "before_test_steps" ADD CONSTRAINT "before_test_steps_test_id_before_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."before_tests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "before_tests" ADD CONSTRAINT "before_tests_launch_id_launches_id_fk" FOREIGN KEY ("launch_id") REFERENCES "public"."launches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "before_tests" ADD CONSTRAINT "before_tests_test_context_id_test_contexts_id_fk" FOREIGN KEY ("test_context_id") REFERENCES "public"."test_contexts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "before_tests" ADD CONSTRAINT "before_tests_status_id_test_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."test_statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "launches" ADD CONSTRAINT "launches_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paths" ADD CONSTRAINT "paths_test_id_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_arguments" ADD CONSTRAINT "test_arguments_test_id_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_contexts" ADD CONSTRAINT "test_contexts_launch_id_launches_id_fk" FOREIGN KEY ("launch_id") REFERENCES "public"."launches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_contexts" ADD CONSTRAINT "test_contexts_parent_test_context_id_test_contexts_id_fk" FOREIGN KEY ("parent_test_context_id") REFERENCES "public"."test_contexts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_statuses" ADD CONSTRAINT "test_statuses_group_id_test_status_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."test_status_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_steps" ADD CONSTRAINT "test_steps_test_id_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tests" ADD CONSTRAINT "tests_launch_id_launches_id_fk" FOREIGN KEY ("launch_id") REFERENCES "public"."launches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tests" ADD CONSTRAINT "tests_test_context_id_test_contexts_id_fk" FOREIGN KEY ("test_context_id") REFERENCES "public"."test_contexts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tests" ADD CONSTRAINT "tests_status_id_test_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."test_statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE VIEW "public"."test_entities" AS ((((select "launch_id", "parent_test_context_id" as "parent_context_id", 'test context' as "entity_type", "id", "title", "created_timestamp", "started_timestamp", "finished_timestamp", null as "status_id" from "test_contexts") union all (select "launch_id", "test_context_id" as "parent_context_id", 'before test' as "entity_type", "id", "title", "created_timestamp", "started_timestamp", "finished_timestamp", "status_id" from "before_tests")) union all (select "launch_id", "test_context_id" as "parent_context_id", 'test' as "entity_type", "id", "title", "created_timestamp", "started_timestamp", "finished_timestamp", "status_id" from "tests")) union all (select "launch_id", "test_context_id" as "parent_context_id", 'after test' as "entity_type", "id", "title", "created_timestamp", "started_timestamp", "finished_timestamp", "status_id" from "after_tests"));