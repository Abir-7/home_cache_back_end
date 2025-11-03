import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

import { timestamp } from "drizzle-orm/pg-core";

import { Tasks } from "./task.schema";
import { pgEnum } from "drizzle-orm/pg-core";
import { timestamps } from "../db/helper/columns.helpers";
export const taskStatusEnum = pgEnum("task_status", [
  "pending",
  "completed",
  "skipped",
]);

export const TaskInstances = pgTable("task_instances", {
  id: uuid("id").primaryKey().defaultRandom(),
  task_id: uuid("task_id")
    .notNull()
    .references(() => Tasks.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  status: taskStatusEnum("status").default("pending"),
  completed_at: timestamp("completed_at"),
  ...timestamps,
});
