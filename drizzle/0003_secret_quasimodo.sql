ALTER TYPE "public"."task_status" ADD VALUE 'ignored' BEFORE 'completed';--> statement-breakpoint
ALTER TABLE "user_home_data" ADD COLUMN "home_heating_type" varchar[];--> statement-breakpoint
ALTER TABLE "user_home_data" ADD COLUMN "home_heating_power" varchar;--> statement-breakpoint
ALTER TABLE "user_home_data" ADD COLUMN "home_cooling_type" varchar[];--> statement-breakpoint
ALTER TABLE "user_home_data" ADD COLUMN "responsible_for" varchar[];--> statement-breakpoint
ALTER TABLE "user_home_data" ADD COLUMN "want_to_track" varchar[];--> statement-breakpoint
ALTER TABLE "user_home_data" ADD COLUMN "last_service_data" jsonb;