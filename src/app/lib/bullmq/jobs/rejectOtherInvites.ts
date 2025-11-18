import { HomeRoomRepository } from "../../../repositories/home_room.repository";

export async function handleRejectOtherInvites(data: {
  accepted_invite_id: string;
  receiver_id: string;
}): Promise<void> {
  await HomeRoomRepository.rejectOtherInvites(
    data.accepted_invite_id,
    data.receiver_id
  );
}
