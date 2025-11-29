import { and, desc, eq, gt, gte, inArray, lt, lte, or, sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Tasks } from "../schema/task.schema";
import { db, schema } from "../db";
import { TaskAssignments, taskStatus } from "../schema/task_assignment.schema";
import { TaskFilter } from "../dtos/task.dtos";
import { getSeasonRangeFromDate } from "../utils/helper/task_season/getSeasonRange";

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
  user_ids: string[], // <-- array of user IDs
  filter: TaskFilter = "upcoming"
) => {
  console.log(user_ids, "ssss");
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

// const getTasksBySeason = async (user_ids: string[], today = new Date()) => {
//   const { start, end } = getSeasonRangeFromDate(today);

//   const pendingStatuses = ["pending", "ignored"] as const;

//   // Base filter: tasks created by user OR assigned to user
//   const baseFilter = or(
//     inArray(Tasks.created_by, user_ids),
//     inArray(TaskAssignments.assign_to, user_ids)
//   );

//   // === Overdue: pending or ignored AND date < today AND inside season ===
//   const overdue = await db
//     .select()
//     .from(Tasks)
//     .leftJoin(TaskAssignments, eq(TaskAssignments.task_id, Tasks.id))
//     .where(
//       and(
//         baseFilter,
//         inArray(TaskAssignments.status, pendingStatuses),
//         gte(TaskAssignments.date, start),
//         lt(TaskAssignments.date, today) // before today
//       )
//     )
//     .orderBy(TaskAssignments.date);

//   // === Upcoming: only pending AND date >= today AND inside season ===
//   const upcoming = await db
//     .select()
//     .from(Tasks)
//     .leftJoin(TaskAssignments, eq(TaskAssignments.task_id, Tasks.id))
//     .where(
//       and(
//         baseFilter,
//         eq(TaskAssignments.status, "pending"), // only pending
//         gte(TaskAssignments.date, today),
//         lte(TaskAssignments.date, end) // inside season
//       )
//     )
//     .orderBy(TaskAssignments.date);

//   // === Completed: completed AND date inside season ===
//   const completed = await db
//     .select()
//     .from(Tasks)
//     .leftJoin(TaskAssignments, eq(TaskAssignments.task_id, Tasks.id))
//     .where(
//       and(
//         baseFilter,
//         eq(TaskAssignments.status, "completed"),
//         gte(TaskAssignments.date, start),
//         lte(TaskAssignments.date, end)
//       )
//     )
//     .orderBy(TaskAssignments.date);

//   return {
//     season: { start, end },
//     overdue,
//     upcoming,
//     completed,
//   };
// };

const getTasksBySeason = async (user_ids: string[], today = new Date()) => {
  const { start, end } = getSeasonRangeFromDate(today);

  const baseFilter = or(
    inArray(Tasks.created_by, user_ids),
    inArray(TaskAssignments.assign_to, user_ids)
  );

  const allTasks = await db
    .select({
      id: Tasks.id,
      title: Tasks.title,
      description: Tasks.description,
      initial_date: Tasks.initial_date,
      assign_to: TaskAssignments.assign_to,
      status: TaskAssignments.status,
      assignment_date: TaskAssignments.date,
    })
    .from(Tasks)
    .leftJoin(TaskAssignments, eq(TaskAssignments.task_id, Tasks.id))
    .where(and(baseFilter, gte(TaskAssignments.date, start)))
    .orderBy(TaskAssignments.date);

  // Split into categories in JS
  const overdue: typeof allTasks = [];
  const upcoming: typeof allTasks = [];
  const completed: typeof allTasks = [];

  allTasks.forEach((task) => {
    const date = task.assignment_date || task.initial_date;
    // skip if outside season
    if (date < start || date > end) return;

    if (task.status === taskStatus[2]) {
      completed.push(task);
    } else if (task.status === taskStatus[0]) {
      if (date >= today) upcoming.push(task);
      else overdue.push(task);
    } else if (task.status === taskStatus[1]) {
      // ignored tasks are overdue if inside season
      overdue.push(task);
    } else if (!task.status) {
      // unassigned tasks without status → consider upcoming
      if (date >= today) upcoming.push(task);
      else overdue.push(task);
    }
  });

  return {
    season: { start, end },
    overdue,
    upcoming,
    completed,
  };
};

const getAssignedTaskCountsBySeason = async (
  user_ids: string[],
  today = new Date()
) => {
  const { start, end } = getSeasonRangeFromDate(today);
  const pendingStatuses = [taskStatus[0], taskStatus[1]] as const;

  const assignedTasks = await db
    .select({
      status: TaskAssignments.status,
      date: TaskAssignments.date,
    })
    .from(TaskAssignments)
    .where(
      and(
        inArray(TaskAssignments.assign_to, user_ids),
        gte(TaskAssignments.date, start),
        lte(TaskAssignments.date, end)
      )
    );

  let completedCount = 0;
  let pendingCount = 0;

  assignedTasks.forEach((task) => {
    if (task.status === "completed") completedCount += 1;
    else if (pendingStatuses.includes(task.status)) pendingCount += 1;
  });

  return {
    completed: completedCount,
    pending: pendingCount,
  };
};

const getHomeHealthPercentage = async (
  user_ids: string[],
  today = new Date()
) => {
  const { start, end } = getSeasonRangeFromDate(today);

  const assignedTasks = await db
    .select({
      status: TaskAssignments.status,
    })
    .from(TaskAssignments)
    .where(
      and(
        inArray(TaskAssignments.assign_to, user_ids),
        gte(TaskAssignments.date, start),
        lte(TaskAssignments.date, end)
      )
    );

  const totalTasks = assignedTasks.length;
  const completedTasks = assignedTasks.filter(
    (t) => t.status === "completed"
  ).length;

  const homeHealth = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return Number(homeHealth.toFixed(2));
};

export const TaskRepository = {
  addTask,
  getTaskById,
  getUserTasks,
  getHomeTasks,
  getTasksBySeason,
  getAssignedTaskCountsBySeason,
  getHomeHealthPercentage,
};
