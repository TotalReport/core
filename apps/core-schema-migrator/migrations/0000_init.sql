CREATE TABLE IF NOT EXISTS "after_test_arguments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"index" integer,
	"value" text,
	"before_test_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "after_test_steps" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp,
	"after_test_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "after_tests" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp,
	"launch_id" uuid,
	"status_id" varchar NOT NULL,
	"arguments_hash" varchar(8) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "after_tests_to_tests" (
	"after_test_id" uuid NOT NULL,
	"test_id" uuid NOT NULL,
	CONSTRAINT "after_tests_to_tests_after_test_id_test_id_pk" PRIMARY KEY("after_test_id","test_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "before_test_arguments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"index" integer,
	"value" text,
	"before_test_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "before_test_steps" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp,
	"before_test_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "before_tests" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp,
	"launch_id" uuid,
	"status_id" varchar NOT NULL,
	"arguments_hash" varchar(8) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "before_tests_to_tests" (
	"before_test_id" uuid NOT NULL,
	"test_id" uuid NOT NULL,
	CONSTRAINT "before_tests_to_tests_before_test_id_test_id_pk" PRIMARY KEY("before_test_id","test_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "launches" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp,
	"report_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "paths" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"test_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reports" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "test_arguments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"index" integer,
	"value" text,
	"test_id" uuid
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
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp,
	"test_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tests" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"started_timestamp" timestamp,
	"finished_timestamp" timestamp,
	"launch_id" uuid,
	"status_id" varchar NOT NULL,
	"arguments_hash" varchar(8) NOT NULL
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
 ALTER TABLE "after_tests" ADD CONSTRAINT "after_tests_status_id_test_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."test_statuses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "after_tests_to_tests" ADD CONSTRAINT "after_tests_to_tests_after_test_id_after_tests_id_fk" FOREIGN KEY ("after_test_id") REFERENCES "public"."after_tests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "after_tests_to_tests" ADD CONSTRAINT "after_tests_to_tests_test_id_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "before_tests" ADD CONSTRAINT "before_tests_status_id_test_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."test_statuses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "before_tests_to_tests" ADD CONSTRAINT "before_tests_to_tests_before_test_id_before_tests_id_fk" FOREIGN KEY ("before_test_id") REFERENCES "public"."before_tests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "before_tests_to_tests" ADD CONSTRAINT "before_tests_to_tests_test_id_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "tests" ADD CONSTRAINT "tests_status_id_test_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."test_statuses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;