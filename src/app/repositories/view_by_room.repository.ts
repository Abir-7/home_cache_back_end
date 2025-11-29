import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { RoomType, ViewByRoom } from "../schema/view_by_room.schema";
import { db, schema } from "../db";
import { and, eq } from "drizzle-orm";
import { RoomItem } from "../schema/room_item.schema";
import { sql } from "drizzle-orm";
import { AppError } from "../utils/serverTools/AppError";
import { appConfig } from "../config/appConfig";

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
    with: { type: { columns: { image: true, type: true } } },
    columns: {
      id: true,
      room_name: true,
      name: true,
      type_id: true,
    },
  });

  console.log(all_room);
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
    with: {
      items: { columns: { id: true, item: true } },
      //  type: { columns: { image: true, type: true } },
    },
    columns: {
      image: true,
      id: true,
      type_id: true,
      name: true,
      room_name: true,
    },
  });

  if (!room_by_id) {
    throw new AppError("Room not found", 404);
  }

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
//========== room type =====
const addRoomType = async (
  data: typeof RoomType.$inferInsert | (typeof RoomType.$inferInsert)[],
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;

  // ensure data is always an array
  const values = Array.isArray(data) ? data : [data];

  return await client
    .insert(RoomType)
    .values(values)
    .onConflictDoNothing()
    .returning();
};

const getAllRoomType = async () => {
  return await db.query.RoomType.findMany();
};

const getRoomTypeById = async (id: string) => {
  return await db.query.RoomType.findFirst({ where: eq(RoomType.id, id) });
};

const updateRoomType = async (
  id: string,
  data: Partial<typeof RoomType.$inferInsert>,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  return await client
    .update(RoomType)
    .set(data)
    .where(eq(RoomType.id, id))
    .returning();
};

const deleteRoomType = async (
  id: string,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  return await client.delete(RoomType).where(eq(RoomType.id, id)).returning();
};

const get_user_same_room_amount = async (
  user_id: string,
  type_id: string
): Promise<number> => {
  const result = await db
    .select({ total: sql<number>`count(*)` })
    .from(ViewByRoom)
    .where(
      and(eq(ViewByRoom.added_by, user_id), eq(ViewByRoom.type_id, type_id))
    );
  return result[0]?.total ?? 0;
};

export const defaultRoom = async () => {
  // https://k10swf0g-6000.inc1.devtunnels.ms/images/default/room/bath.png

  const data = [
    {
      type: "Bed",
      image: `${appConfig.server.base_url}/images/default/room/bed.png",
      image_id: "/images/default/room/bed.png`,
    },
    {
      type: "Bath",
      image: `${appConfig.server.base_url}/images/default/room/bath.png",
      image_id: "/images/default/room/bath.png`,
    },
    {
      type: "Basement",
      image: `${appConfig.server.base_url}/images/default/room/basement.png",
      image_id: "/images/default/room/basement.png`,
    },
    {
      type: "Dining",
      image: `${appConfig.server.base_url}/images/default/room/dining.png",
      image_id: "/images/default/room/dining.png`,
    },
    {
      type: "Garage",
      image: `${appConfig.server.base_url}/images/default/room/garage.png",
      image_id: "/images/default/room/garage.png`,
    },
    {
      type: "Gym",
      image: `${appConfig.server.base_url}/images/default/room/gym.png",
      image_id: "/images/default/room/gym.png`,
    },
    {
      type: "Kitchen",
      image: `${appConfig.server.base_url}/images/default/room/kitchen.png",
      image_id: "/images/default/room/kitchen.png`,
    },
    {
      type: "Laundry",
      image: `${appConfig.server.base_url}/images/default/room/laundry.png",
      image_id: "/images/default/room/laundry.png`,
    },
    {
      type: "Living Room",
      image: `${appConfig.server.base_url}/images/default/room/living.png",
      image_id: "/images/default/room/living.png`,
    },
    {
      type: "Media",
      image: `${appConfig.server.base_url}/images/default/room/media.png",
      image_id: "/images/default/room/media.png`,
    },
    {
      type: "Mudroom",
      image: `${appConfig.server.base_url}/images/default/room/mud.png",
      image_id: "/images/default/room/mud.png`,
    },
    {
      type: "Office",
      image: `${appConfig.server.base_url}/images/default/room/office.png",
      image_id: "/images/default/room/office.png`,
    },
    {
      type: "Other",
      image: `${appConfig.server.base_url}/images/default/room/other.png",
      image_id: "/images/default/room/other.png`,
    },
    {
      type: "Play Room",
      image: `${appConfig.server.base_url}/images/default/room/play.png",
      image_id: "/images/default/room/play.png`,
    },
    {
      type: "Sun Room",
      image: `${appConfig.server.base_url}/images/default/room/sun.png",
      image_id: "images/default/room/sun.png`,
    },
  ];

  await addRoomType(data.map((i) => ({ ...i, type: i.type.toLowerCase() })));
};

export const ViewByRoomRepository = {
  addRoom,
  getAllRoom,
  getRoomById,
  updateRoomById,
  getAllRoomType,
  updateRoomType,
  deleteRoomType,
  addRoomType,
  getRoomTypeById,
  get_user_same_room_amount,
};
