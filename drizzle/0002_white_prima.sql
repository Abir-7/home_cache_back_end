ALTER TABLE "providers_rating" DROP CONSTRAINT "providers_rating_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "providers_rating" ADD CONSTRAINT "providers_rating_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE no action ON UPDATE no action;