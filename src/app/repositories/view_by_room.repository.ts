import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { ViewByRoom } from "../schema/view_by_room.schema";
import { db, schema } from "../db";
import { and, eq } from "drizzle-orm";
import { RoomItem } from "../schema/room_item.schema";

const addRoom = async (
  data: typeof ViewByRoom.$inferInsert,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  const [created] = await client.insert(ViewByRoom).values(data).returning();
  return created;
};

const getAllRoom = async (
  user_id: string,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  const all_room = await client.query.ViewByRoom.findMany({
    where: eq(ViewByRoom.added_by, user_id),
  });
  return all_room;
};

const getRoomById = async (
  room_id: string,
  user_id: string,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  const room_by_id = await client.query.ViewByRoom.findFirst({
    where: and(eq(ViewByRoom.id, room_id), eq(ViewByRoom.added_by, user_id)),
    with: { items: { columns: { id: true, item: true } } },
  });
  return room_by_id;
};

const updateRoomById = async (
  room_id: string,
  user_id: string,
  data: Partial<typeof ViewByRoom.$inferInsert>,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  const [room_by_id] = await client
    .update(ViewByRoom)
    .set(data)
    .where(and(eq(ViewByRoom.id, room_id), eq(ViewByRoom.added_by, user_id)))
    .returning();
  return room_by_id;
};

export const ViewByRoomRepository = {
  addRoom,
  getAllRoom,
  getRoomById,
  updateRoomById,
};
