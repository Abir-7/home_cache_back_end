import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { RoomItemDetails } from "../schema/room_item_details.schema";
import { db, schema } from "../db";
import { eq } from "drizzle-orm";

const addRoomItemDetails = async (
  data:
    | typeof RoomItemDetails.$inferInsert
    | (typeof RoomItemDetails.$inferInsert)[],
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;

  // Ensure data is always an array
  const values = Array.isArray(data) ? data : [data];

  const savedData = await client
    .insert(RoomItemDetails)
    .values(values)
    .returning();

  return savedData;
};

const getAllItemByRoomId = async (room_id: string) => {
  const data = await db.query.RoomItemDetails.findMany({
    where: eq(RoomItemDetails.room_id, room_id),
  });
  return data;
};

const getItemDetailsById = async (id: string) => {
  const data = await db.query.RoomItemDetails.findFirst({
    where: eq(RoomItemDetails.id, id),
  });
  return data;
};

const editRoomItemDetails = async (
  data: Partial<typeof RoomItemDetails.$inferInsert>,
  item_id: string,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  const [saved_data] = await client
    .update(RoomItemDetails)
    .set(data)
    .where(eq(RoomItemDetails.room_item_id, item_id))
    .returning();
  return saved_data;
};

export const RoomItemDetailsRepository = {
  addRoomItemDetails,
  getAllItemByRoomId,
  getItemDetailsById,
  editRoomItemDetails,
};
