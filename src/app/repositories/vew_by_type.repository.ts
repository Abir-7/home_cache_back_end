import { eq } from "drizzle-orm";
import { db, schema } from "../db"; // your drizzle instance

import { NodePgDatabase } from "drizzle-orm/node-postgres";

import { viewByTypes } from "../schema/view_by_types.schema";

const addViewByType = async (
  data: typeof viewByTypes.$inferInsert,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;

  const [item] = await client.insert(viewByTypes).values(data).returning();

  return item;
};

const getViewByTypeByUser = async (
  userId: string,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;

  return client
    .select()
    .from(viewByTypes)
    .where(eq(viewByTypes.added_by, userId));
};

const getViewByTypeById = async (
  id: string,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;

  const [item] = await client
    .select()
    .from(viewByTypes)
    .where(eq(viewByTypes.id, id));

  return item || null;
};
const updateViewByType = async (
  id: string,
  data: Partial<typeof viewByTypes.$inferInsert>,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;

  const [updated] = await client
    .update(viewByTypes)
    .set(data)
    .where(eq(viewByTypes.id, id))
    .returning();

  return updated;
};
const deleteViewByType = async (
  id: string,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;

  const [deleted] = await client
    .delete(viewByTypes)
    .where(eq(viewByTypes.id, id))
    .returning();

  return deleted;
};

export const ViewByTypesRepository = {
  addViewByType,
  getViewByTypeById,
  getViewByTypeByUser,
  deleteViewByType,
  updateViewByType,
};
