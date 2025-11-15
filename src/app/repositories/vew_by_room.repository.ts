import { eq } from "drizzle-orm";
import { db, schema } from "../db"; // your drizzle instance

import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { viewByRooms } from "../schema/vew_by_room.schema";

const addViewByRoom = async (
  data: typeof viewByRooms.$inferInsert,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;

  const [item] = await client.insert(viewByRooms).values(data).returning();

  return item;
};

const getViewByRoomsByUser = async (
  userId: string,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;

  return client
    .select()
    .from(viewByRooms)
    .where(eq(viewByRooms.added_by, userId));
};

const getViewByRoomById = async (
  id: string,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;

  const [item] = await client
    .select()
    .from(viewByRooms)
    .where(eq(viewByRooms.id, id));

  return item || null;
};
const updateViewByRoom = async (
  id: string,
  data: Partial<typeof viewByRooms.$inferInsert>,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;

  const [updated] = await client
    .update(viewByRooms)
    .set(data)
    .where(eq(viewByRooms.id, id))
    .returning();

  return updated;
};
const deleteViewByRoom = async (
  id: string,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;

  const [deleted] = await client
    .delete(viewByRooms)
    .where(eq(viewByRooms.id, id))
    .returning();

  return deleted;
};

export const ViewByRoomsRepository = {
  addViewByRoom,
  getViewByRoomById,
  getViewByRoomsByUser,
  deleteViewByRoom,
  updateViewByRoom,
};
