import { varchar } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { Users } from "./user.schema";
import { relations } from "drizzle-orm";
import { RoomItem } from "./room_item.schema";
import { integer } from "drizzle-orm/pg-core";

export const ViewByRoom = pgTable("view_by_room", {
  id: uuid("id").primaryKey().defaultRandom(),
  type_id: uuid("type_id")
    .references(() => RoomType.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name"),
  // value: integer("value").notNull(),
  room_name: varchar("room_name"),
  added_by: uuid("added_by")
    .notNull()
    .references(() => Users.id, { onDelete: "cascade" }),
  image: varchar("image"),
  image_id: varchar("image_id"),
});

export const RoomType = pgTable("room_type", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type").notNull().unique(),
  image: varchar("image"),
  image_id: varchar("image_id"),
});

export const ViewByRoomRelations = relations(ViewByRoom, ({ many, one }) => ({
  items: many(RoomItem),
  type: one(RoomType, {
    fields: [ViewByRoom.type_id],
    references: [RoomType.id],
  }),
}));
