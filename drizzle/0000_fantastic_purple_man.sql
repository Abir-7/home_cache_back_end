CREATE TYPE "public"."document_types" AS ENUM('warranty', 'insurance', 'receipt', 'quote', 'manual', 'other');--> statement-breakpoint
CREATE TYPE "public"."room_member_status" AS ENUM('accepted', 'pending', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."recurrence_type" AS ENUM('none', 'weekly', 'monthly', 'quarterly', 'annually');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('pending', 'ignored', 'completed');--> statement-breakpoint
CREATE TYPE "public"."user_type" AS ENUM('user', 'provider');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('super_admin', 'user');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'pending_verification', 'blocked', 'disabled', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."auth_type" AS ENUM('email', 'forgot-password', 'resend', 'token');--> statement-breakpoint
CREATE TYPE "public"."gender_enum" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "document_types" NOT NULL,
	"files" jsonb NOT NULL,
	"added_by" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "insurance_documents" (
	"document_id" uuid PRIMARY KEY NOT NULL,
	"policy_number" varchar NOT NULL,
	"provider_name" varchar NOT NULL,
	"coverage_start_date" date,
	"coverage_end_date" date NOT NULL,
	"premium_amount" numeric,
	"claim_contact_info" text
);
--> statement-breakpoint
CREATE TABLE "manual_documents" (
	"document_id" uuid PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"brand_company" varchar NOT NULL,
	"item_id" varchar,
	"model_number" varchar,
	"manual_type" varchar,
	"publication_date" date
);
--> statement-breakpoint
CREATE TABLE "other_documents" (
	"document_id" uuid PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"brand_company" varchar,
	"url" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "quote_documents" (
	"document_id" uuid PRIMARY KEY NOT NULL,
	"service_item_quoted" varchar NOT NULL,
	"quote_amount" numeric NOT NULL,
	"quote_date" date,
	"vendor_company_name" varchar,
	"valid_until_date" date,
	"contact_info" text,
	"quote_reference_number" varchar
);
--> statement-breakpoint
CREATE TABLE "receipt_documents" (
	"document_id" uuid PRIMARY KEY NOT NULL,
	"vendor_store_name" varchar NOT NULL,
	"date_of_purchase" date,
	"total_amount_paid" numeric NOT NULL,
	"payment_method" varchar,
	"order_number" varchar
);
--> statement-breakpoint
CREATE TABLE "warranty_documents" (
	"document_id" uuid PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"brand" varchar NOT NULL,
	"warranty_start_date" date,
	"warranty_end_date" date NOT NULL,
	"serial_number" varchar,
	"service_contact_info" text
);
--> statement-breakpoint
CREATE TABLE "room_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"home_room_id" uuid NOT NULL,
	"sender" uuid NOT NULL,
	"receiver" uuid NOT NULL,
	"status" "room_member_status" DEFAULT 'pending' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "room_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"home_room_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "room_members_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "follow_providers" (
	"user_id" uuid NOT NULL,
	"provider_id" uuid NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
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
CREATE TABLE "room_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" uuid NOT NULL,
	"item" varchar NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "room_items_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" uuid NOT NULL,
	"room_item_id" uuid NOT NULL,
	"type" varchar,
	"location" varchar,
	"image" varchar,
	"image_id" varchar,
	"brand" varchar,
	"brand_line" varchar,
	"color" varchar,
	"finish" varchar,
	"last_painted" date,
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
	"user_type" "user_type" NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"status" "task_status" DEFAULT 'pending' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(320) NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"password_hash" text NOT NULL,
	"is_verified" boolean DEFAULT true NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
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
	"home_heating_type" varchar[],
	"home_heating_power" varchar,
	"home_cooling_type" varchar[],
	"responsible_for" varchar[],
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"want_to_track" varchar[],
	"last_service_data" jsonb
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
CREATE TABLE "room_type" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar NOT NULL,
	"image" varchar,
	"image_id" varchar,
	CONSTRAINT "room_type_type_unique" UNIQUE("type")
);
--> statement-breakpoint
CREATE TABLE "view_by_room" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type_id" uuid NOT NULL,
	"name" varchar,
	"value" integer NOT NULL,
	"added_by" uuid NOT NULL,
	"image" varchar,
	"image_id" varchar
);
--> statement-breakpoint
CREATE TABLE "view_by_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"added_by" uuid NOT NULL,
	"type" varchar,
	"title" varchar,
	"location" varchar,
	"image" varchar,
	"image_id" varchar,
	"note" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_added_by_user_profiles_user_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."user_profiles"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insurance_documents" ADD CONSTRAINT "insurance_documents_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manual_documents" ADD CONSTRAINT "manual_documents_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "other_documents" ADD CONSTRAINT "other_documents_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_documents" ADD CONSTRAINT "quote_documents_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receipt_documents" ADD CONSTRAINT "receipt_documents_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warranty_documents" ADD CONSTRAINT "warranty_documents_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_members" ADD CONSTRAINT "room_members_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prodivers_rating" ADD CONSTRAINT "prodivers_rating_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_item" ADD CONSTRAINT "room_item_room_id_view_by_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."view_by_room"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_items_details" ADD CONSTRAINT "room_items_details_room_id_view_by_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."view_by_room"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_items_details" ADD CONSTRAINT "room_items_details_room_item_id_room_item_id_fk" FOREIGN KEY ("room_item_id") REFERENCES "public"."room_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_by_user_profiles_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user_profiles"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_authentications" ADD CONSTRAINT "user_authentications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_home_data" ADD CONSTRAINT "user_home_data_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "view_by_room" ADD CONSTRAINT "view_by_room_type_id_room_type_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."room_type"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "view_by_room" ADD CONSTRAINT "view_by_room_added_by_users_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "view_by_types" ADD CONSTRAINT "view_by_types_added_by_users_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;