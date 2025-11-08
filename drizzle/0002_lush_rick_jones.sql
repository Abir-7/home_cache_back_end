CREATE TYPE "public"."user_type" AS ENUM('user', 'provider');--> statement-breakpoint
ALTER TABLE "task_assignments" DROP CONSTRAINT "task_assignments_assign_to_user_profiles_user_id_fk";
--> statement-breakpoint
ALTER TABLE "task_assignments" ADD COLUMN "user_type" "user_type" NOT NULL;