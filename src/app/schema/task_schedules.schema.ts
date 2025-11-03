import { pgEnum } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { Tasks } from "./task.schema";
import { timestamp } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
export const scheduleTypeEnum = pgEnum("schedule_type", [
  "weekly",
  "biweekly",
  "monthly",
  "annually",
  "spring",
  "winter",
  "summer",
  "fall",
  "biannually",
  "once",
]);

export const taskSchedules = pgTable("task_schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  task_id: uuid("task_id")
    .notNull()
    .references(() => Tasks.id, { onDelete: "cascade" }),
  schedule_type: scheduleTypeEnum("schedule_type").notNull().default("once"),
  task_date: timestamp("date").notNull(),
  interval_weeks: integer("interval_weeks").default(0),
});
