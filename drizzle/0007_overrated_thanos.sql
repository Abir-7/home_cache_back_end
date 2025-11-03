CREATE TABLE "prodivers_rating" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"rating" numeric(3, 2) NOT NULL,
	"comment" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
DROP TABLE "providers_rating" CASCADE;--> statement-breakpoint
ALTER TABLE "provider" ADD COLUMN "rating" numeric(3, 2) DEFAULT '0.0';--> statement-breakpoint
ALTER TABLE "prodivers_rating" ADD CONSTRAINT "prodivers_rating_provider_id_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."provider"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prodivers_rating" ADD CONSTRAINT "prodivers_rating_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;