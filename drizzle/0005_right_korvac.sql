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
ALTER TABLE "view_by_types" ADD CONSTRAINT "view_by_types_added_by_users_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;