import { pgTable, uuid, pgEnum } from "drizzle-orm/pg-core";
import { timestamps } from "../db/helper/columns.helpers";

const roomInviteStatusValues = ["accepted", "pending", "rejected"] as const;

export const RoomInviteStatusEnum = pgEnum(
  "room_member_status",
  roomInviteStatusValues
);

export type RoomInviteStatus = (typeof roomInviteStatusValues)[number];

export const RoomInvites = pgTable("room_invites", {
  id: uuid("id").primaryKey().defaultRandom(),
  home_room_id: uuid("home_room_id").notNull(),
  // .references(() => HomeRooms.id, { onDelete: "cascade" }),
  sender: uuid("user_id").notNull(),
  receiver: uuid("user_id").notNull(),
  status: RoomInviteStatusEnum("status").notNull().default("pending"),
  ...timestamps,
});
