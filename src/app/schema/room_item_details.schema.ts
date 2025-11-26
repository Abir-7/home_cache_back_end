import { pgTable, varchar, uuid, date } from "drizzle-orm/pg-core";

import { timestamps } from "../db/helper/columns.helpers";
import { relations } from "drizzle-orm";
import { ViewByRoom } from "./view_by_room.schema";
import { RoomItem } from "./room_item.schema";

export const RoomItemDetails = pgTable("room_items_details", {
  id: uuid("id").primaryKey().defaultRandom(),
  room_id: uuid("room_id")
    .notNull()
    .references(() => ViewByRoom.id, { onDelete: "cascade" }),
  room_item_id: uuid("room_item_id")
    .notNull()
    .references(() => RoomItem.id, { onDelete: "cascade" }),
  type: varchar("type"),
  location: varchar("location"),
  image: varchar("image"),
  image_id: varchar("image_id"),
  brand: varchar("brand"),
  brand_line: varchar("brand_line"),
  color: varchar("color"),
  finish: varchar("finish"),
  last_painted: date("last_painted"),
  ...timestamps,
});

export const RoomItemDetailsRelation = relations(
  RoomItemDetails,
  ({ one }) => ({
    room_item: one(RoomItem, {
      fields: [RoomItemDetails.room_item_id],
      references: [RoomItem.id],
    }),
    room: one(ViewByRoom, {
      fields: [RoomItemDetails.room_id],
      references: [ViewByRoom.id],
    }),
  })
);
