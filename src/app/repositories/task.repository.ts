import { desc, eq, inArray, or, sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Tasks } from "../schema/task.schema";
import { db, schema } from "../db";
import { TaskAssignments } from "../schema/task_assignment.schema";
import { TaskFilter } from "../dtos/task.dtos";

import { AppError } from "../utils/serverTools/AppError";

interface ITask {
  title: string;
  description: string | null;
  date: Date | null;
  initial_date: Date;
  task_id: string;
}

const addTask = async (
  data: typeof Tasks.$inferInsert,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  const [add_task] = await client.insert(Tasks).values(data).returning();
  return add_task;
};

const getTaskById = async (id: string, tx?: NodePgDatabase<typeof schema>) => {
  const client = tx ?? db;
  const task = await client.query.Tasks.findFirst({
    where: eq(Tasks.id, id),
    columns: {
      id: true,
      created_by: true,
      title: true,
      description: true,
      initial_date: true,
      recurrence_type: true,
    },
  });

  if (!task) throw new AppError("Task not found", 404);

  return task;
};

export const getUserTasks = async (
  user_id: string,
  filter: TaskFilter = "overdue" // default
) => {
  const tasks = await db
    .selectDistinctOn([Tasks.id], {
      title: Tasks.title,
      description: Tasks.description,
      date: TaskAssignments.date,
      initial_date: Tasks.initial_date,
      task_id: Tasks.id,
    })
    .from(Tasks)
    .leftJoin(TaskAssignments, eq(Tasks.id, TaskAssignments.task_id))
    .where(
      or(eq(Tasks.created_by, user_id), eq(TaskAssignments.assign_to, user_id))
    )
    .orderBy(Tasks.id);

  const now = new Date();

  const upcoming: ITask[] = [];
  const overdue: ITask[] = [];

  for (const task of tasks) {
    if (!task.date) {
      upcoming.push(task);
    } else {
      const taskDate = new Date(task.date);
      if (taskDate >= now) {
        upcoming.push(task);
      } else {
        overdue.push(task);
      }
    }
  }

  return { upcoming, overdue };
};

export const TaskRepository = { addTask, getTaskById, getUserTasks };
