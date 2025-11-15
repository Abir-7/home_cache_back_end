import { timestamp, varchar } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { UserProfiles } from "./user_profiles.schema";
import { text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { jsonb } from "drizzle-orm/pg-core";
import { timestamps } from "../db/helper/columns.helpers";

export type File = {
  file_url: string;
  file_id: string;
};

export const Documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type").notNull(),
  added_by: uuid("added_by")
    .references(() => UserProfiles.user_id)
    .notNull(),
  files: jsonb("files").$type<File[]>().notNull(),
  title: varchar("title").notNull(),
  brand: varchar("brand").notNull(),
  exp_date: timestamp("exp_date"),
  url: varchar("url"),
  note: varchar("note"),
  ...timestamps,
});

export const DocumentsRelations = relations(Documents, ({ one }) => ({
  addedBy: one(UserProfiles, {
    fields: [Documents.added_by],
    references: [UserProfiles.user_id],
  }),
}));
