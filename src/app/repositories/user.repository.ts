import { eq, ilike, inArray } from "drizzle-orm";
import { db, schema } from "../db";
import { Users } from "../schema/user.schema";

import { UserHomeData } from "../schema/user_home_data";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { tr } from "zod/v4/locales";
import { UserProfiles } from "../schema/user_profiles.schema";

const findByEmail = async (email: string) => {
  const [user] = await db.select().from(Users).where(eq(Users.email, email));
  return user || null;
};

const findById = async (id: string) => {
  const [user] = await db.select().from(Users).where(eq(Users.id, id));
  return user || null;
};
const findByIdWithProfile = async (id: string) => {
  const user = await db.query.Users.findFirst({
    where: eq(Users.id, id),
    columns: { email: true, id: true },
    with: {
      profile: { columns: { image: true, first_name: true, last_name: true } },
    },
  });

  return user || null;
};

const getAllUsers = async () => {
  return await db.select().from(Users);
};

const updateUser = async (
  id: string,
  data: Partial<typeof Users.$inferInsert>,
  trx?: NodePgDatabase<typeof schema>
) => {
  const [user] = await (trx || db)
    .update(Users)
    .set({ ...data, updated_at: new Date() })
    .where(eq(Users.id, id))
    .returning();
  return user;
};

const createUsersHomeData = async (
  data: typeof UserHomeData.$inferInsert,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  const created_home_data = await client
    .insert(UserHomeData)
    .values(data)
    .returning();

  return created_home_data;
};

const updateUserHomeData = async (
  user_id: string,
  data: Partial<typeof UserHomeData.$inferInsert>,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx || db;
  const [updated_home_data] = await client
    .update(UserHomeData)
    .set({ ...data, updated_at: new Date() })
    .where(eq(UserHomeData.user_id, user_id))
    .returning();

  return updated_home_data;
};

const getUsersHomeData = async (user_id: string) => {
  const users_home_data = await db.query.UserHomeData.findFirst({
    where: eq(UserHomeData.user_id, user_id),
  });
  return users_home_data;
};

const deleteUser = async (id: string) => {
  await db.delete(Users).where(eq(Users.id, id));
  return true;
};

export const searchUser = async (email: string) => {
  return await db.query.Users.findMany({
    where: (user, { ilike }) => ilike(user.email, `%${email}%`),
    columns: {
      id: true,
      email: true,
    },
    with: {
      profile: {
        columns: {
          first_name: true,
          last_name: true,
          image: true,
        },
      },
    },
  });
};

const getSomeUsersByIds = async (user_ids: string[]) => {
  const users = await db.query.Users.findMany({
    where: inArray(Users.id, user_ids),
    columns: {
      id: true,
      email: true,
    },
    with: {
      profile: { columns: { image: true, last_name: true, first_name: true } },
    },
  });
  return users;
};

const getUserInfo = async (user_id: string) => {
  const users = await db.query.Users.findFirst({
    where: eq(Users.id, user_id),
    columns: {
      id: true,
      email: true,
      is_home_data_given: true,
      role: true,
    },
    with: {
      profile: {
        columns: {
          image: true,
          last_name: true,
          first_name: true,
          address: true,
          gender: true,
          mobile: true,
        },
      },
    },
  });
  return users;
};

const updateUserProfile = async (
  id: string,
  data: Partial<typeof UserProfiles.$inferInsert>,
  trx?: NodePgDatabase<typeof schema>
) => {
  const [user_profile] = await (trx || db)
    .update(UserProfiles)
    .set({ ...data, updated_at: new Date() })
    .where(eq(UserProfiles.user_id, id))
    .returning();
  return user_profile;
};

export const UserRepository = {
  findByEmail,
  findById,
  getAllUsers,
  updateUser,
  createUsersHomeData,
  updateUserHomeData,
  getUsersHomeData,
  searchUser,
  findByIdWithProfile,
  deleteUser,
  getSomeUsersByIds,
  getUserInfo,
  updateUserProfile,
};
