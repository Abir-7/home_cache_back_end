import { text } from "drizzle-orm/pg-core";
import { boolean } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { UserProfiles } from "./user_profiles.schema";
import { timestamp } from "drizzle-orm/pg-core";
import { timestamps } from "../db/helper/columns.helpers";

export const Tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_by: uuid("created_by")
    .notNull()
    .references(() => UserProfiles.user_id), // user who created the task
  title: text("title").notNull(),
  description: text("description"),
  is_recurring: boolean("is_recurring").default(false),
  ...timestamps,
});
