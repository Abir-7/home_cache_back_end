import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Providers } from "../schema/providers.schema";
import { db, schema } from "../db";
import { and, asc, desc, eq, gt, gte, ilike, lt, or, sql } from "drizzle-orm";
import { TaskAssignments } from "../schema/task_assignment.schema";
import { Tasks } from "../schema/task.schema";
import { getDateRange } from "../utils/helper/provider_repo_helper/get_date_range";
import { ProviderFilter } from "../types/prodiver_repository.interface";
import { FollowProviders } from "../schema/provider_follow.schema";

const createProvider = async (
  data: typeof Providers.$inferInsert,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  const [created_provider] = await client
    .insert(Providers)
    .values(data)
    .returning();

  return created_provider;
};

const updateProvider = async (
  data: Partial<typeof Providers.$inferInsert>,
  provider_id: string,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;

  const [updated] = await client
    .update(Providers)
    .set(data)
    .where(eq(Providers.id, provider_id))
    .returning();

  return updated;
};

const getProviderById = async (id: string) => {
  const [provider] = await db
    .select()
    .from(Providers)
    .where(eq(Providers.id, id))
    .limit(1);

  return provider; // returns single Provider | undefined
};

const getProviderAppointments = async (providerId: string,user_id:string) => {
  const now = new Date();

  // ----- LAST APPOINTMENT -----
  const [lastAppointment] = await db
    .select({
      date: TaskAssignments.date,
      title: Tasks.title,
    })
    .from(TaskAssignments)
    .leftJoin(Tasks, eq(TaskAssignments.task_id, Tasks.id))
    .where(
      and(
        eq(TaskAssignments.assign_to, providerId),
        lt(TaskAssignments.date, now),eq(Tasks.created_by,user_id)
      )
    )
    .orderBy(desc(TaskAssignments.date))
    .limit(1);

  // ----- NEXT APPOINTMENT -----
  const [nextAppointment] = await db
    .select({
      date: TaskAssignments.date,
      title: Tasks.title,
    })
    .from(TaskAssignments)
    .leftJoin(Tasks, eq(TaskAssignments.task_id, Tasks.id))
    .where(
      and(
        eq(TaskAssignments.assign_to, providerId),
        gt(TaskAssignments.date, now),eq(Tasks.created_by,user_id)
      )
    )
    .orderBy(asc(TaskAssignments.date))
    .limit(1);

  return {
    lastAppointment :lastAppointment||null,
    nextAppointment:nextAppointment || null,
  };
};

const getAllProviders = async () => {
  const providers = await db.select().from(Providers);

  return providers; // returns Provider[]
};

const getFilteredProviders = async (
  filter: ProviderFilter = {},
  user_id: string
) => {
  const { min_rating, type, service_range, search } = filter;
  const dateLimit = getDateRange(service_range);

  // 🔹 Base filters (always apply)
  const baseFilters = [
    min_rating ? gte(Providers.rating, String(min_rating)) : undefined,
    type ? eq(Providers.type, type) : undefined,
  ].filter(Boolean);

  // 🔹 Optional search (matches name OR type, case-insensitive)
  if (search && search.trim() !== "") {
    baseFilters.push(
      or(
        ilike(Providers.name, `%${search}%`),
        ilike(Providers.type, `%${search}%`)
      )
    );
  }

  // 🔹 Conditional filters (only if service_range given)
  if (dateLimit) {
    baseFilters.push(
      and(eq(Tasks.created_by, user_id), gte(TaskAssignments.date, dateLimit))
    );
  }
  console.log(dateLimit, user_id);
  const providers = await db
    .select({
      provider_id: Providers.id,
      name: Providers.name,
      company: Providers.company,
      type: Providers.type,
      rating: Providers.rating,
      last_service_date: sql<Date>`
  MAX(
    CASE 
      WHEN ${TaskAssignments.status} = 'completed' 
      THEN ${TaskAssignments.date} 
      ELSE NULL 
    END
  )
`,
    })
    .from(Providers)
    .leftJoin(TaskAssignments, eq(TaskAssignments.assign_to, Providers.id))
    .leftJoin(Tasks, eq(TaskAssignments.task_id, Tasks.id))
    .where(baseFilters.length ? and(...baseFilters) : undefined)
    .groupBy(Providers.id)
    .orderBy(desc(sql`MAX(${TaskAssignments.date})`));

  return providers;
};


const getFilteredProvidersWithUserFollow = async (
  filter: ProviderFilter = {},
  user_id: string
) => {
  const { min_rating, type, service_range, search } = filter;
  const dateLimit = getDateRange(service_range);

  // 🔹 Base filters (always apply)
  const baseFilters = [
    min_rating ? gte(Providers.rating, String(min_rating)) : undefined,
    type ? eq(Providers.type, type) : undefined,
  ].filter(Boolean);

  // 🔹 Optional search (matches name OR type, case-insensitive)
  if (search && search.trim() !== "") {
    baseFilters.push(
      or(
        ilike(Providers.name, `%${search}%`),
        ilike(Providers.type, `%${search}%`)
      )
    );
  }

  // 🔹 Conditional filters (only if service_range given)
  if (dateLimit) {
    baseFilters.push(
      and(eq(Tasks.created_by, user_id), gte(TaskAssignments.date, dateLimit))
    );
  }
  console.log(dateLimit, user_id);
  const providers = await db
    .select({
      provider_id: Providers.id,
      name: Providers.name,
      company: Providers.company,
      type: Providers.type,
      rating: Providers.rating,
      last_service_date: sql<Date>`
  MAX(
    CASE 
      WHEN ${TaskAssignments.status} = 'completed' 
      THEN ${TaskAssignments.date} 
      ELSE NULL 
    END
  )
`,  is_followed: sql<boolean>`
  BOOL_OR(${FollowProviders.user_id} IS NOT NULL)
`,

    })
    .from(Providers)
    .leftJoin(TaskAssignments, eq(TaskAssignments.assign_to, Providers.id))
    .leftJoin(Tasks, eq(TaskAssignments.task_id, Tasks.id))  .leftJoin(
    FollowProviders,
    and(
      eq(FollowProviders.provider_id, Providers.id),
      eq(FollowProviders.user_id, user_id)
    )
  )
    .where(baseFilters.length ? and(...baseFilters) : undefined)
    .groupBy(Providers.id)
    .orderBy(desc(sql`MAX(${TaskAssignments.date})`));

  return providers;
};


const toogleProviderFollow=async(user_id:string,provider_id:string,action:"delete"|"add")=>{

if(action==="add"){
const data=await db.insert(FollowProviders).values({user_id,provider_id}).returning()
}else{
  const data=await db.delete(FollowProviders).where(and(eq(FollowProviders.user_id,user_id),eq(FollowProviders.provider_id,provider_id))).returning()
}
}

const getProviderFollow =async(user_id:string,provider_id:string)=>{

  const data= await db.query.FollowProviders.findFirst({where:and(eq(FollowProviders.user_id,user_id),eq(FollowProviders.provider_id,provider_id))})

return data
}


export const ProviderRepository = {
  createProvider,
  updateProvider,
  getAllProviders,
  getProviderById,
  getFilteredProviders, 
  getProviderAppointments,
  getFilteredProvidersWithUserFollow, 
  toogleProviderFollow,
  getProviderFollow
};
