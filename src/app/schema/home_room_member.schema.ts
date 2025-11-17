import { pgTable, uuid } from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";
import { UserProfiles } from "./user_profiles.schema";
import { timestamps } from "../db/helper/columns.helpers";

export const RoomMembers = pgTable("room_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  home_room_id: uuid("home_room_id").notNull(),
  user_id: uuid("user_id")
    .notNull()
    .unique()
    .references(() => UserProfiles.user_id, { onDelete: "cascade" }),
  ...timestamps,
});

export const roomMembersRelations = relations(RoomMembers, ({ one }) => ({
  user_profile: one(UserProfiles, {
    fields: [RoomMembers.user_id],
    references: [UserProfiles.user_id],
  }),
}));
