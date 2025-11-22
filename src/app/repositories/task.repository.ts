import { and, desc, eq, inArray, or, sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Tasks } from "../schema/task.schema";
import { db, schema } from "../db";
import { TaskAssignments } from "../schema/task_assignment.schema";
import { TaskFilter } from "../dtos/task.dtos";

import { AppError } from "../utils/serverTools/AppError";

interface ITask {
  id: string;
  title: string;
  description: string | null;
  initial_date: Date;
  date: Date | null;
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

  //if (!task) throw new AppError("Task not found", 404);

  return task || null;
};

const getUserTasks = async (
  user_id: string,
  filter: TaskFilter = "upcoming"
) => {
  // Fetch tasks assigned to the user or created by the user
  const tasks = await db
    .select({
      id: Tasks.id,
      title: Tasks.title,
      description: Tasks.description,
      initial_date: Tasks.initial_date,
      date: TaskAssignments.date,
    })
    .from(Tasks)
    .leftJoin(TaskAssignments, eq(TaskAssignments.task_id, Tasks.id))
    .where(
      or(
        eq(Tasks.created_by, user_id),
        and(
          eq(TaskAssignments.assign_to, user_id),
          eq(TaskAssignments.status, "pending")
        )
      )
    )
    .orderBy(desc(TaskAssignments.date));

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

  // Apply filter if needed
  if (filter === "upcoming") return upcoming;
  if (filter === "overdue") return overdue;
};


const getHomeTasks = async (
  user_ids: string[],      // <-- array of user IDs
  filter: TaskFilter = "upcoming"
) => {
  const tasks = await db
    .select({
      id: Tasks.id,
      title: Tasks.title,
      description: Tasks.description,
      initial_date: Tasks.initial_date,
      date: TaskAssignments.date,
    })
    .from(Tasks)
    .leftJoin(TaskAssignments, eq(TaskAssignments.task_id, Tasks.id))
    .where(
      or(
        inArray(Tasks.created_by, user_ids),
        and(
          inArray(TaskAssignments.assign_to, user_ids),
          eq(TaskAssignments.status, "pending")
        )
      )
    )
    .orderBy(desc(TaskAssignments.date));

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

  if (filter === "upcoming") return upcoming;
  if (filter === "overdue") return overdue;
  return { upcoming, overdue }; // optional fallback
};
export const TaskRepository = { addTask, getTaskById, getUserTasks,getHomeTasks };
