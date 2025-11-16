import { timestamps } from "../db/helper/columns.helpers"; // if you use shared timestamps
import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";

import { Users } from "./user.schema";
import { relations } from "drizzle-orm";
export const viewByTypes = pgTable("view_by_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  added_by: uuid("added_by")
    .notNull()
    .references(() => Users.id, { onDelete: "cascade" }),

  type: varchar("type"),
  title: varchar("title"),
  location: varchar("location"),
  image: varchar("image"),
  image_id: varchar("image_id"),
  note: text("note"),
  ...timestamps,
});

export const viewByTypesRelations = relations(viewByTypes, ({ one }) => ({
  addedBy: one(Users, {
    fields: [viewByTypes.added_by],
    references: [Users.id],
  }),
}));
