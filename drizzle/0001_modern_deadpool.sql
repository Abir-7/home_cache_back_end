ALTER TABLE "task_assignments" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "task_assignments" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "task_assignments" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "task_assignments" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "task_assignments" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "task_assignments" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "task_assignments" ADD COLUMN "deleted_at" timestamp;