ALTER TABLE "room_invites" ADD COLUMN "sender" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "room_invites" ADD COLUMN "receiver" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "room_invites" DROP COLUMN "user_id";