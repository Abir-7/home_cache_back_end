import { text } from "drizzle-orm/pg-core";
import { boolean } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { UserProfiles } from "./user_profiles.schema";
import { timestamps } from "../db/helper/columns.helpers";
import { pgEnum } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { TaskAssignments } from "./task_assignment.schema";

export const recurrenceArray = [
  "none",
  "weekly",
  "monthly",
  "quarterly",
  "annually",
] as const;
export const recurrenceEnum = pgEnum("recurrence_type", recurrenceArray);

export const Tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_by: uuid("created_by")
    .notNull()
    .references(() => UserProfiles.user_id),
  title: text("title").notNull(),
  description: text("description"),
  initial_date: timestamp("initial_date", { withTimezone: true }).notNull(),
  recurrence_type: recurrenceEnum("recurrence_type").default("none"),
  ...timestamps,
});

export const TasksRelations = relations(Tasks, ({ many, one }) => ({
  assignments: many(TaskAssignments), // a task can have many assignments
  creator: one(UserProfiles, {
    fields: [Tasks.created_by],
    references: [UserProfiles.user_id],
  }),
}));
