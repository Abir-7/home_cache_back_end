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


const getAllMemberOfHome=async(home_room_id:string)=>{
    const member = await db.query.RoomMembers.findMany({
    where: eq(RoomMembers.home_room_id, home_room_id),columns:{id:true,home_room_id:true,user_id:true}
  });
  return member.map(m=>m.user_id)
}


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


const getInviteList = async (user_id: string) => {
  const data = await db.query.RoomInvites.findMany({
    where: and(eq(RoomInvites.receiver, user_id),
  eq(RoomInvites.status,"pending")),
    with: {
      sender: {columns:{user_id:true,first_name:true,last_name:true,image:true}}
    },
  });

  return data.map(d=>({invite_id:d.id,sender:d.sender}));
};




export const HomeRoomRepository = {
  removeMember,
  addMember,
  makeInvite,
  changeInviteStatus,
  getMemberById,
  removeInvite,
  rejectOtherInvites, 
  getInviteList,getAllMemberOfHome
};
