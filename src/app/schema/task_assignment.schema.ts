import { pgTable, uuid } from "drizzle-orm/pg-core";
import { TaskInstances } from "./task_instance.schema";
import { timestamp } from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";
import { timestamps } from "../db/helper/columns.helpers";

export const assigneeTypeEnum = pgEnum("assignee_type", ["user", "provider"]);
export const taskAssignments = pgTable("task_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  task_instance_id: uuid("task_instance_id")
    .notNull()
    .references(() => TaskInstances.id, { onDelete: "cascade" }),
  assignee_id: uuid("assignee_id").notNull(), // user_id or provider_id
  assignee_type: assigneeTypeEnum("assignee_type").notNull(),
  assigned_at: timestamp("assigned_at").defaultNow(),
  ...timestamps,
});
