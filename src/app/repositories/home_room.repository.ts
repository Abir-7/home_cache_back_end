import { NodePgDatabase } from "drizzle-orm/node-postgres";

import { db, schema } from "../db";
import { RoomMembers } from "../schema/home_room_member.schema";
import { and, eq, ne } from "drizzle-orm";
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
  status: RoomInviteStatus,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  const [updated] = await client
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
  tx?: any
) => {
  const client = tx ?? db;
  const rows = Array.isArray(data) ? data : [data];
  const createdMembers = await client
    .insert(RoomMembers)
    .values(rows)
    .onConflictDoNothing()
    .returning();
  return createdMembers;
};

const getMemberById = async (user_id: string) => {
  const member = await db.query.RoomMembers.findFirst({
    where: eq(RoomMembers.user_id, user_id),
  });
  return member;
};

const removeMember = async (
  user_id: string,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  const [deleted_member] = await client
    .delete(RoomMembers)
    .where(eq(RoomMembers.user_id, user_id))
    .returning();
  return deleted_member;
};

const removeInvite = async (
  home_room_id: string,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  const [deleted_invite] = await client
    .delete(RoomInvites)
    .where(eq(RoomInvites.home_room_id, home_room_id))
    .returning();
  return deleted_invite;
};

const rejectOtherInvites = async (
  acceptedInviteId: string,
  receiverId: string
) => {
  const updated = await db
    .update(RoomInvites)
    .set({ status: "rejected" })
    .where(
      and(
        eq(RoomInvites.receiver, receiverId),
        ne(RoomInvites.id, acceptedInviteId)
      )
    )
    .returning();

  return updated;
};

export const HomeRoomRepository = {
  removeMember,
  addMember,
  makeInvite,
  changeInviteStatus,
  getMemberById,
  removeInvite,
  rejectOtherInvites,
};
