import { desc, eq, inArray, or, sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Tasks } from "../schema/task.schema";
import { db, schema } from "../db";
import { TaskAssignments } from "../schema/task_assignment.schema";
import { TaskFilter } from "../dtos/task.dtos";
import { TaskAssignedRepository } from "./task_assigned.repository";
import { AppError } from "../utils/serverTools/AppError";

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
  userId: string,
  filter: TaskFilter = "overdue" // default
) => {
  const now = new Date();

  // Step 1: fetch tasks created by user OR tasks where user is assigned
  const createdTasks = await db
    .select({
      task_id: Tasks.id,
      title: Tasks.title,
      description: Tasks.description,
      initial_date: Tasks.initial_date,
      // recurrence_type: Tasks.recurrence_type,
      // created_by: Tasks.created_by,
    })
    .from(Tasks)
    .where(eq(Tasks.created_by, userId));

  const taskIds = createdTasks.map((t) => t.task_id);

  const assignedTasks = await db
    .select({
      task_id: TaskAssignments.task_id,
    })
    .from(TaskAssignments)
    .where(eq(TaskAssignments.assign_to, userId));

  const allTaskIds = Array.from(
    new Set([...taskIds, ...assignedTasks.map((t) => t.task_id)])
  );

  // Step 2: fetch latest assignment per task
  const latestAssignments = await db
    .select({
      id: TaskAssignments.id,
      task_id: TaskAssignments.task_id,
      // assign_to: TaskAssignments.assign_to,
      // user_type: TaskAssignments.user_type,
      status: TaskAssignments.status,
      date: TaskAssignments.date,
      //    created_at: TaskAssignments.created_at,
    })
    .from(TaskAssignments)
    .where(inArray(TaskAssignments.task_id, allTaskIds))
    .orderBy(desc(TaskAssignments.date));

  const latestAssignmentsMap = new Map<string, (typeof latestAssignments)[0]>();
  for (const assignment of latestAssignments) {
    if (!latestAssignmentsMap.has(assignment.task_id)) {
      latestAssignmentsMap.set(assignment.task_id, assignment);
    }
  }

  // Step 3: fetch all tasks using unique taskIds
  const allTasks = await db
    .select({
      task_id: Tasks.id,
      title: Tasks.title,
      description: Tasks.description,
      initial_date: Tasks.initial_date,
      // recurrence_type: Tasks.recurrence_type,
      //  created_by: Tasks.created_by,
    })
    .from(Tasks)
    .where(inArray(Tasks.id, allTaskIds));

  // Step 4: attach latest assignment and filter by upcoming/overdue
  const filteredTasks = allTasks
    .map((task) => {
      const latest = latestAssignmentsMap.get(task.task_id) ?? null;
      return {
        ...task,
        latest_assignment: latest,
      };
    })
    .filter((task) => {
      const latest = task.latest_assignment;
      if (!latest || latest.status !== "pending") return false;

      if (filter === "upcoming") return latest.date > now;
      if (filter === "overdue") return latest.date < now;

      return true;
    });

  return filteredTasks.map((task) => ({
    title: task.title,
    description: task.description,
    date: task.latest_assignment?.date || task.initial_date,
    task_id: task.task_id,
  }));
};

export const TaskRepository = { addTask, getTaskById, getUserTasks };
