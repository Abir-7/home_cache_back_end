import { pgTable, varchar, uuid, date } from "drizzle-orm/pg-core";

import { Users } from "./user.schema";
import { timestamps } from "../db/helper/columns.helpers";

export const viewByRooms = pgTable("view_by_rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  added_by: uuid("added_by")
    .notNull()
    .references(() => Users.id, { onDelete: "cascade" }),
  type: varchar("type"),
  location: varchar("location"),
  image: varchar("image"),
  image_id: varchar("image_id"),
  brand: varchar("brand"),
  brand_line_color: varchar("brand_line_color"),
  finish: varchar("finish"),
  room: varchar("room"),
  last_painted: date("last_painted"),
  ...timestamps,
});
