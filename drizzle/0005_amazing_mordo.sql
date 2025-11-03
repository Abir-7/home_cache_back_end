ALTER TABLE "documents" ADD COLUMN "title" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "brand" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "exp_date" timestamp;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "url" varchar;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "note" varchar;