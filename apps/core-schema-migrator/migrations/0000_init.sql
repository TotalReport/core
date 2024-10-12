CREATE TABLE IF NOT EXISTS "after_test_arguments" (
	"before_test_id" uuid NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"index" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"type" varchar(256) NOT NULL,
	"value" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "after_test_steps" (
	"after_test_id" uuid NOT NULL,
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp,
	"is_successful" boolean,
	"error_message" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "after_tests" (
	"launch_id" uuid NOT NULL,
	"test_context_id" bigint,
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp,
	"status_id" varchar,
	"arguments_hash" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "before_test_arguments" (
	"before_test_id" uuid NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"index" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"type" varchar(256) NOT NULL,
	"value" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "before_test_steps" (
	"before_test_id" uuid NOT NULL,
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp,
	"is_successful" boolean,
	"error_message" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "before_tests" (
	"launch_id" uuid NOT NULL,
	"test_context_id" bigint,
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp,
	"status_id" varchar,
	"arguments_hash" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "launches" (
	"report_id" uuid NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "paths" (
	"test_id" uuid,
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reports" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "test_arguments" (
	"test_id" uuid NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"index" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"type" varchar(256) NOT NULL,
	"value" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "test_contexts" (
	"launch_id" uuid NOT NULL,
	"parent_test_context_id" bigint,
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "test_status_groups" (
	"id" varchar(20) PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "test_statuses" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"group_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "test_steps" (
	"test_id" uuid NOT NULL,
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp,
	"is_successful" boolean,
	"error_message" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tests" (
	"launch_id" uuid NOT NULL,
	"test_context_id" bigint,
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp,
	"status_id" varchar,
	"arguments_hash" uuid
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "after_test_arguments" ADD CONSTRAINT "after_test_arguments_before_test_id_after_tests_id_fk" FOREIGN KEY ("before_test_id") REFERENCES "public"."after_tests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "after_test_steps" ADD CONSTRAINT "after_test_steps_after_test_id_after_tests_id_fk" FOREIGN KEY ("after_test_id") REFERENCES "public"."after_tests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "after_tests" ADD CONSTRAINT "after_tests_launch_id_launches_id_fk" FOREIGN KEY ("launch_id") REFERENCES "public"."launches"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "after_tests" ADD CONSTRAINT "after_tests_test_context_id_test_contexts_id_fk" FOREIGN KEY ("test_context_id") REFERENCES "public"."test_contexts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "after_tests" ADD CONSTRAINT "after_tests_status_id_test_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."test_statuses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "before_test_arguments" ADD CONSTRAINT "before_test_arguments_before_test_id_before_tests_id_fk" FOREIGN KEY ("before_test_id") REFERENCES "public"."before_tests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "before_test_steps" ADD CONSTRAINT "before_test_steps_before_test_id_before_tests_id_fk" FOREIGN KEY ("before_test_id") REFERENCES "public"."before_tests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "before_tests" ADD CONSTRAINT "before_tests_launch_id_launches_id_fk" FOREIGN KEY ("launch_id") REFERENCES "public"."launches"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "before_tests" ADD CONSTRAINT "before_tests_test_context_id_test_contexts_id_fk" FOREIGN KEY ("test_context_id") REFERENCES "public"."test_contexts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "before_tests" ADD CONSTRAINT "before_tests_status_id_test_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."test_statuses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "launches" ADD CONSTRAINT "launches_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "paths" ADD CONSTRAINT "paths_test_id_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "test_arguments" ADD CONSTRAINT "test_arguments_test_id_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "test_contexts" ADD CONSTRAINT "test_contexts_launch_id_launches_id_fk" FOREIGN KEY ("launch_id") REFERENCES "public"."launches"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "test_contexts" ADD CONSTRAINT "test_contexts_parent_test_context_id_test_contexts_id_fk" FOREIGN KEY ("parent_test_context_id") REFERENCES "public"."test_contexts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "test_statuses" ADD CONSTRAINT "test_statuses_group_id_test_status_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."test_status_groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "test_steps" ADD CONSTRAINT "test_steps_test_id_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tests" ADD CONSTRAINT "tests_launch_id_launches_id_fk" FOREIGN KEY ("launch_id") REFERENCES "public"."launches"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tests" ADD CONSTRAINT "tests_test_context_id_test_contexts_id_fk" FOREIGN KEY ("test_context_id") REFERENCES "public"."test_contexts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tests" ADD CONSTRAINT "tests_status_id_test_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."test_statuses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
