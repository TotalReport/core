CREATE TYPE "public"."test_entity_types" AS ENUM('beforeTest', 'test', 'afterTest');--> statement-breakpoint
CREATE TABLE "launches" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"arguments" text,
	"started_timestamp" timestamp NOT NULL,
	"finished_timestamp" timestamp
);
--> statement-breakpoint
CREATE TABLE "test_entities" (
	"launch_id" bigint NOT NULL,
	"id" bigserial PRIMARY KEY NOT NULL,
	"entity_type" "test_entity_types" NOT NULL,
	"title" varchar(256) NOT NULL,
	"arguments" json,
	"external_arguments" json,
	"started_timestamp" timestamp NOT NULL,
	"finished_timestamp" timestamp,
	"status_id" varchar,
	"title_hash" uuid NOT NULL,
	"arguments_hash" uuid NOT NULL,
	"external_arguments_hash" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_entity_steps" (
	"test_id" bigint NOT NULL,
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"started_timestamp" timestamp NOT NULL,
	"finished_timestamp" timestamp,
	"is_successful" boolean,
	"error_message" text,
	"thread" varchar(256),
	"process" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "test_status_groups" (
	"id" varchar(4) PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"color" varchar(7) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_statuses" (
	"id" varchar(4) PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_timestamp" timestamp NOT NULL,
	"group_id" varchar NOT NULL,
	"color" varchar(7) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "test_entities" ADD CONSTRAINT "test_entities_launch_id_launches_id_fk" FOREIGN KEY ("launch_id") REFERENCES "public"."launches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_entities" ADD CONSTRAINT "test_entities_status_id_test_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."test_statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_entity_steps" ADD CONSTRAINT "test_entity_steps_test_id_test_entities_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."test_entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_statuses" ADD CONSTRAINT "test_statuses_group_id_test_status_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."test_status_groups"("id") ON DELETE no action ON UPDATE no action;