CREATE TABLE "view_by_rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"added_by" uuid NOT NULL,
	"type" varchar,
	"location" varchar,
	"image" varchar,
	"image_id" varchar,
	"brand" varchar,
	"brand_line_color" varchar,
	"finish" varchar,
	"room" varchar,
	"last_painted" date,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "view_by_rooms" ADD CONSTRAINT "view_by_rooms_added_by_users_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;