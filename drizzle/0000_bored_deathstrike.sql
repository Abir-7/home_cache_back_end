CREATE TYPE "public"."recurrence_type" AS ENUM('none', 'weekly', 'monthly', 'quarterly', 'annually');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('pending', 'completed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('super_admin', 'user');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'pending_verification', 'blocked', 'disabled', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."auth_type" AS ENUM('email', 'forgot-password', 'resend', 'token');--> statement-breakpoint
CREATE TYPE "public"."gender_enum" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar NOT NULL,
	"added_by" uuid NOT NULL,
	"files" jsonb NOT NULL,
	"title" varchar NOT NULL,
	"brand" varchar NOT NULL,
	"exp_date" timestamp,
	"url" varchar,
	"note" varchar,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "provider" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar,
	"company" varchar,
	"name" varchar,
	"mobile" text,
	"url" text,
	"documents" jsonb DEFAULT '[]'::jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"rating" numeric(3, 2) DEFAULT '0.0'
);
--> statement-breakpoint
CREATE TABLE "prodivers_rating" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"rated_by" uuid NOT NULL,
	"task_id" uuid NOT NULL,
	"rating" numeric(2, 1) NOT NULL,
	"review" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_by" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"initial_date" timestamp with time zone NOT NULL,
	"recurrence_type" "recurrence_type" DEFAULT 'none',
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "task_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"assign_to" uuid NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"status" "task_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(320) NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"password_hash" text NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"status" "user_status" DEFAULT 'pending_verification' NOT NULL,
	"need_to_reset_password" boolean DEFAULT false NOT NULL,
	"is_home_data_given" boolean,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_authentications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"otp" varchar(10),
	"token" text,
	"type" "auth_type" NOT NULL,
	"expire_date" timestamp NOT NULL,
	"is_success" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_home_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"home_type" varchar,
	"home_address" varchar,
	"home_power_type" varchar[],
	"home_water_supply_type" varchar[],
	"home_utilities" varchar[],
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"user_name" varchar(50),
	"mobile" varchar(20),
	"address" text,
	"gender" "gender_enum",
	"image" text,
	"image_id" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "user_profiles_user_name_unique" UNIQUE("user_name"),
	CONSTRAINT "user_profiles_mobile_unique" UNIQUE("mobile")
);
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_added_by_user_profiles_user_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."user_profiles"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prodivers_rating" ADD CONSTRAINT "prodivers_rating_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_by_user_profiles_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user_profiles"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_assign_to_user_profiles_user_id_fk" FOREIGN KEY ("assign_to") REFERENCES "public"."user_profiles"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_authentications" ADD CONSTRAINT "user_authentications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_home_data" ADD CONSTRAINT "user_home_data_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;