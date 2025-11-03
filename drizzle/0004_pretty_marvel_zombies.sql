CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar NOT NULL,
	"added_by" uuid NOT NULL,
	"files" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_added_by_user_profiles_user_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."user_profiles"("user_id") ON DELETE no action ON UPDATE no action;