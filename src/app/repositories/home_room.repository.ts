import { NodePgDatabase } from "drizzle-orm/node-postgres";

import { db, schema } from "../db";
import { RoomMembers } from "../schema/home_room_member.schema";
import { and, eq } from "drizzle-orm";
import {
  RoomInvites,
  RoomInviteStatus,
} from "../schema/home_room_invite.schema";

const makeInvite = async (
  data: typeof RoomInvites.$inferInsert,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  const [created_invite] = await client
    .insert(RoomInvites)
    .values(data)
    .returning();
  return created_invite;
};

const changeInviteStatus = async (
  invite_id: string,
  receiver_id: string,
  status: RoomInviteStatus
) => {
  const [updated] = await db
    .update(RoomInvites)
    .set({ status: status })
    .where(
      and(eq(RoomInvites.id, invite_id), eq(RoomInvites.receiver, receiver_id))
    )
    .returning();
  return updated;
};

const addMember = async (
  data: typeof RoomMembers.$inferInsert | (typeof RoomMembers.$inferInsert)[],
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;

  const createdMembers = await client
    .insert(RoomMembers)
    .values(Array.isArray(data) ? data : [data])
    .returning();

  return createdMembers;
};

const removeMember = async (user_id: string) => {
  const [deleted_member] = await db
    .delete(RoomMembers)
    .where(eq(RoomMembers.user_id, user_id))
    .returning();
  return deleted_member;
};

export const HomRoomRepository = {
  removeMember,
  addMember,
  makeInvite,
  changeInviteStatus,
};
