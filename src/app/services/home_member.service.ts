import { HomeRoomRepository } from "../repositories/home_room.repository";
import { UserRepository } from "../repositories/user.repository";
import { randomUUID } from "crypto";
import { AppError } from "../utils/serverTools/AppError";
import { Repository } from "../repositories/helper.repository";
import { rejectInviteQueue } from "../lib/bullmq/queues/rejectOtherInvites.queues";

const serachMember = async (search_text: string) => {
  console.log(search_text);
  const searched_user = await UserRepository.searchUser(search_text);
  return searched_user;
};

const inviteUser = async (sender: string, receiver: string) => {
  let home_id: string;
  const [sender_data, receiver_data] = await Promise.all([
    HomeRoomRepository.getMemberById(sender),
    HomeRoomRepository.getMemberById(receiver),
  ]);

  if (
    sender_data?.home_room_id &&
    receiver_data?.home_room_id &&
    sender_data.home_room_id === receiver_data.home_room_id
  ) {
    console.log(receiver_data?.home_room_id, sender_data?.home_room_id);
    throw new AppError("User is already a member");
  }

  if (sender_data) {
    home_id = sender_data.home_room_id;
  } else {
    home_id = randomUUID();
  }

  if ((sender_data && !receiver_data) || (!sender_data && !receiver_data)) {
    return await HomeRoomRepository.makeInvite({
      home_room_id: home_id,
      receiver: receiver,
      sender: sender,
    });
  } else {
    throw new AppError("User is already a member of another home");
  }
};

const getInviteList = async (receiver: string) => {
  const data = await HomeRoomRepository.getInviteList(receiver);
  return data;
};

const acceptInviteStatus = async (invite_id: string, user_id: string) => {
  const user_home_data = await HomeRoomRepository.getMemberById(user_id);
  if (!user_home_data) {
    return await Repository.transaction(async (tx) => {
      const data = await HomeRoomRepository.changeInviteStatus(
        invite_id,
        user_id,
        "accepted",
        tx
      );

      await HomeRoomRepository.addMember(
        [
          { home_room_id: data.home_room_id, user_id: data.sender },
          { home_room_id: data.home_room_id, user_id: data.receiver },
        ],
        tx
      );

      await rejectInviteQueue.add("reject_other_invite", {
        accepted_invite_id: data.home_room_id,
        receiver_id: user_id,
      });

      return { status: data.status };
    });
  } else {
    throw new AppError("You are already joined as a home member");
  }
};

const rejectInviteStatus = async (invite_id: string, user_id: string) => {
  const user_home_data = await HomeRoomRepository.getMemberById(user_id);
  if (!user_home_data) {
    const data = await HomeRoomRepository.changeInviteStatus(
      invite_id,
      user_id,
      "rejected"
    );
    return { status: data.status };
  } else {
    throw new AppError("You are already joined as a home member");
  }
};

const leaveAsHomeMember = async (user_id: string) => {
  return await Repository.transaction(async (tx) => {
    const deleted_member_data = await HomeRoomRepository.removeMember(user_id);
    const deleted_Invite_data = await HomeRoomRepository.removeInvite(
      deleted_member_data.home_room_id
    );
    return deleted_member_data;
  });
};

const getMyHomeMembers = async (user_id: string) => {
  const user_home_data = await HomeRoomRepository.getMemberById(user_id);

  if (!user_home_data) {
    const user_data = await UserRepository.getSomeUsersByIds([user_id]);
    return user_data;
  } else {
    if (user_home_data.home_room_id) {
      const home_member_ids = await HomeRoomRepository.getAllMemberOfHome(
        user_home_data.home_room_id
      );

      const user_data = await UserRepository.getSomeUsersByIds(home_member_ids);
      return user_data;
    }
  }
};

export const HomeMemberService = {
  serachMember,
  inviteUser,
  acceptInviteStatus,
  rejectInviteStatus,
  leaveAsHomeMember,
  getInviteList,
  getMyHomeMembers,
};
