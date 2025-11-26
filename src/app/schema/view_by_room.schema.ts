import { varchar } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { Users } from "./user.schema";
import { relations } from "drizzle-orm";
import { RoomItem } from "./room_item.schema";

export const ViewByRoom = pgTable("view_by_room", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type").notNull(),
  name: varchar("name"),
  added_by: uuid("added_by")
    .notNull()
    .references(() => Users.id, { onDelete: "cascade" }),
  image: varchar("image"),
  image_id: varchar("image_id"),
});
export const ViewByRoomRelations = relations(ViewByRoom, ({ many }) => ({
  items: many(RoomItem),
}));
