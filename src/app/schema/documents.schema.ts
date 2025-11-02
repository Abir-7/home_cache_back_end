import { varchar } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { UserProfiles } from "./user_profiles.schema";
import { text } from "drizzle-orm/pg-core";

export const LastServiceByProvider = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type").notNull(),
  added_by: uuid("added_by")
    .references(() => UserProfiles.user_id)
    .notNull(),
  file_url: text("file_url").notNull(),
  file_id: text("file_url").notNull(),
});
