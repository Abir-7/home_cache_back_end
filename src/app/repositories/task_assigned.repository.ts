import { NodePgDatabase } from "drizzle-orm/node-postgres";

import { db, schema } from "../db";
import { TaskAssignments } from "../schema/task_assignment.schema";
import { and, desc, eq, gte, lt, lte, or, sql } from "drizzle-orm";
import { UserProfiles } from "../schema/user_profiles.schema";
import { Providers } from "../schema/providers.schema";
import { RatingRepository } from "./rating.repository";
import { Tasks } from "../schema/task.schema";

const assignMember = async (
  data: typeof TaskAssignments.$inferInsert,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  const [add_task] = await client
    .insert(TaskAssignments)
    .values(data)
    .returning();
  return add_task;
};

const changeMember = async (
  task_assing_id: string,
  data: Partial<typeof TaskAssignments.$inferInsert>,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;

  const [updated_data] = await client
    .update(TaskAssignments)
    .set(data)
    .where(eq(TaskAssignments.id, task_assing_id))
    .returning();

  return updated_data;
};

const lastCompletedServiceWithProfile = async (task_id: string) => {
  // Step 1: get latest completed assignment
  const [assignment] = await db
    .select()
    .from(TaskAssignments)
    .where(
      and(
        eq(TaskAssignments.task_id, task_id),
        eq(TaskAssignments.status, "completed")
      )
    )
    .orderBy(desc(TaskAssignments.date))
    .limit(1);

  if (!assignment) return null;

  // Step 2: fetch profile based on user_type
  let profile: any = null;
  let name: string | null = null;

  let avg_rating = null;
  if (assignment.user_type === "user") {
    [profile] = await db
      .select()
      .from(UserProfiles)
      .where(eq(UserProfiles.user_id, assignment.assign_to))
      .limit(1);
    name = profile
      ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()
      : null;
  } else if (assignment.user_type === "provider") {
    [profile] = await db
      .select()
      .from(Providers)
      .where(eq(Providers.id, assignment.assign_to))
      .limit(1);
    name = profile?.name ?? null;

    avg_rating = await RatingRepository.getProviderAverageRating(
      assignment.assign_to
    );
  }

  // Step 3: combine
  // return {
  //   ...assignment,
  //   last_service_by: profile ?? null,
  // };

  return {
    name,
    date: assignment.date,
    user_type: assignment.user_type,
    user_id: profile.id,
    avg_rating,
  };
};

const latestTaskUserDetails = async (task_id: string) => {
  // get latest assignment for given task
  const [assignment] = await db
    .select()
    .from(TaskAssignments)
    .where(eq(TaskAssignments.task_id, task_id))
    .orderBy(desc(TaskAssignments.created_at))
    .limit(1);

  if (!assignment) return null;

  // get assigned user/provider profile
  let profile = null;

  if (assignment.user_type === "user") {
    [profile] = await db
      .select({
        name: sql<string>`concat(${UserProfiles.first_name}, ' ', ${UserProfiles.last_name})`,
        id: UserProfiles.id,
      })
      .from(UserProfiles)
      .where(eq(UserProfiles.user_id, assignment.assign_to))
      .limit(1);
    profile = { ...profile, user_type: "House Rasident" };
  } else if (assignment.user_type === "provider") {
    [profile] = await db
      .select({ name: Providers.name, id: Providers.id })
      .from(Providers)
      .where(eq(Providers.id, assignment.assign_to))
      .limit(1);
    profile = { ...profile, user_type: "Provider" };
  }

  return {
    // task_id: assignment.task_id,
    date: assignment.date,
    assignee: profile ?? null,
  };
};

const getTaskNotification = async (user_id: string) => {
  const fetchTasks = (upcoming: boolean) =>
    db
      .select({
        id: TaskAssignments.id,
        task_id: TaskAssignments.task_id,
        title: Tasks.title,
        description: Tasks.description,
        date: TaskAssignments.date,
        user_type: TaskAssignments.user_type,

        created_by: Tasks.created_by,
        last_completed_date: sql<string>`(
          SELECT date 
          FROM task_assignments AS t2
          WHERE t2.task_id = ${TaskAssignments.task_id}
          AND t2.status = 'completed'
          ORDER BY date DESC
          LIMIT 1
        )`,
        assign_to: TaskAssignments.assign_to,
      })
      .from(TaskAssignments)
      .innerJoin(Tasks, eq(Tasks.id, TaskAssignments.task_id))
      .where(
        and(
          or(
            and(
              eq(TaskAssignments.user_type, "user"),
              eq(TaskAssignments.assign_to, user_id)
            ),
            and(
              eq(TaskAssignments.user_type, "provider"),
              eq(Tasks.created_by, user_id)
            )
          ),
          eq(TaskAssignments.status, "pending"),
          upcoming
            ? and(
                gte(TaskAssignments.date, sql`NOW()`),
                lte(TaskAssignments.date, sql`NOW() + INTERVAL '3 days'`)
              )
            : lt(TaskAssignments.date, sql`NOW()`)
        )
      )
      .orderBy(TaskAssignments.date);

  const [upcoming, overdue] = await Promise.all([
    fetchTasks(true),
    fetchTasks(false),
  ]);

  const maped_upcomming = upcoming.map(({ id, ...rest }) => ({
    ...rest,
    task_assign_id: id,
    is_overdue: false,
  }));
  const maped_overdue = overdue.map(({ id, ...rest }) => ({
    ...rest,
    task_assign_id: id,
    is_overdue: true,
  }));
  // return {
  //   upcoming: upcoming.map(({ id, ...rest }) => ({
  //     ...rest,
  //     task_assign_id: id,
  //     is_overdue: false,
  //   })),
  //   overdue: overdue.map(({ id, ...rest }) => ({
  //     ...rest,
  //     task_assign_id: id,
  //     is_overdue: true,
  //   })),
  // };
  return [...maped_upcomming, ...maped_overdue];
};

const getLatestTaskAssingInfo = async (task_id: string) => {
  const [assignment] = await db
    .select()
    .from(TaskAssignments)
    .where(eq(TaskAssignments.task_id, task_id))
    .orderBy(desc(TaskAssignments.created_at))
    .limit(1);

  if (!assignment) return null;

  return assignment;
};

const update_task_status = async (
  task_assign_id: string,
  task_status: "ignored" | "completed",
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  const [updated_data] = await client
    .update(TaskAssignments)
    .set({ status: task_status })
    .where(eq(TaskAssignments.id, task_assign_id))
    .returning();
  return updated_data;
};

export const TaskAssignedRepository = {
  assignMember,
  lastCompletedServiceWithProfile,
  latestTaskUserDetails,
  getTaskNotification,
  getLatestTaskAssingInfo,
  changeMember,
  update_task_status,
};
