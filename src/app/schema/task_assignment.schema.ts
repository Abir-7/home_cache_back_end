import { pgTable, uuid, timestamp, text, pgEnum } from "drizzle-orm/pg-core";
import { UserProfiles } from "./user_profiles.schema";
import { Tasks } from "./task.schema";
import { relations } from "drizzle-orm";
import { timestamps } from "../db/helper/columns.helpers";

// Enum for status
export const taskStatusEnum = pgEnum("task_status", [
  "pending",
  "ignored",
  "completed",
]);
export const userTypeEnum = pgEnum("user_type", ["user", "provider"]);
export const TaskAssignments = pgTable("task_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  task_id: uuid("task_id")
    .notNull()
    .references(() => Tasks.id, { onDelete: "cascade" }),
  assign_to: uuid("assign_to").notNull(),
  user_type: userTypeEnum("user_type").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  status: taskStatusEnum("status").default("pending").notNull(),
  ...timestamps,
});

export const TaskAssignmentsRelations = relations(
  TaskAssignments,
  ({ one }) => ({
    task: one(Tasks, {
      fields: [TaskAssignments.task_id],
      references: [Tasks.id],
    }),
  })
);
