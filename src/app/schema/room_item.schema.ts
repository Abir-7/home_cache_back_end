import { pgTable, varchar, uuid, date } from "drizzle-orm/pg-core";

import { timestamps } from "../db/helper/columns.helpers";

import { ViewByRoom } from "./view_by_room.schema";
import { relations } from "drizzle-orm";
import { RoomItemDetails } from "./room_item_details.schema";

export const RoomItem = pgTable("room_item", {
  id: uuid("id").primaryKey().defaultRandom(),
  room_id: uuid("room_id")
    .notNull()
    .references(() => ViewByRoom.id, { onDelete: "cascade" }),
  item: varchar("item").notNull(),
  ...timestamps,
});
export const RoomItemRelations = relations(RoomItem, ({ one }) => ({
  room: one(ViewByRoom, {
    fields: [RoomItem.room_id],
    references: [ViewByRoom.id],
  }),
  item_details: one(RoomItemDetails, {
    fields: [RoomItem.id],
    references: [RoomItemDetails.room_item_id],
  }),
}));
