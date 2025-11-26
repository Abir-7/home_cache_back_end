import { NodePgDatabase } from "drizzle-orm/node-postgres";
// import { eq } from "drizzle-orm";
// import { db, schema } from "../db"; // your drizzle instance

import { RoomItem } from "../schema/room_item.schema";
import { db, schema } from "../db";
import { eq } from "drizzle-orm";

const addRoomItem = async (
  data: typeof RoomItem.$inferInsert | (typeof RoomItem.$inferInsert)[],
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;

  // normalize: ensure always array
  const values = Array.isArray(data) ? data : [data];

  const savedData = await client.insert(RoomItem).values(values).returning();

  return savedData;
};

const deleteItem = async (id: string, tx?: NodePgDatabase<typeof schema>) => {
  const client = tx ?? db;
  const [deleted_data] = await client
    .delete(RoomItem)
    .where(eq(RoomItem.id, id))
    .returning();
  return deleted_data;
};

export const RoomItemRepository = {
  addRoomItem,
  deleteItem,
};
