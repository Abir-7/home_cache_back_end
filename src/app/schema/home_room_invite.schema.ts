import { pgTable, uuid, pgEnum } from "drizzle-orm/pg-core";
import { timestamps } from "../db/helper/columns.helpers";
import { relations } from "drizzle-orm";
import { UserProfiles } from "./user_profiles.schema";

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
  sender: uuid("sender").notNull(),
  receiver: uuid("receiver").notNull(),
  status: RoomInviteStatusEnum("status").notNull().default("pending"),
  ...timestamps,
});


export const RoomInvitesRelations = relations(RoomInvites, ({ one }) => ({
  sender: one(UserProfiles, {
    fields: [RoomInvites.sender],
    references: [UserProfiles.user_id],
  }),

  receiver:  one(UserProfiles, {
    fields: [RoomInvites.sender],
    references: [UserProfiles.user_id],
  }),
}));