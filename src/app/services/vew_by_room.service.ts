import {
  TAddViewByRoomInput,
  TUpdateViewByRoomInput,
} from "../dtos/view_by_room.dtos";
import { ViewByRoomsRepository } from "../repositories/vew_by_room.repository";
import { deleteFile } from "../utils/helper/s3/deleteSingleFile";

const addViewByRoom = async (
  data: TAddViewByRoomInput & {
    added_by: string;
    image: string;
    image_id: string;
  }
) => {
  const savedData = await ViewByRoomsRepository.addViewByRoom(data);
  return savedData;
};

const getViewByRoomsByUser = async (userId: string) => {
  const data = await ViewByRoomsRepository.getViewByRoomsByUser(userId);
  return data;
};

const getViewByRoomById = async (id: string) => {
  const data = await ViewByRoomsRepository.getViewByRoomById(id);
  return data;
};

const updateViewByRoom = async (
  id: string,
  data: TUpdateViewByRoomInput & {
    image?: string;
    image_id?: string;
  }
) => {
  let old_image_id = null;
  if (data.image && data.image_id) {
    const old_data = await ViewByRoomsRepository.getViewByRoomById(id);

    if (old_data && old_data.image_id) {
      old_image_id = old_data.image_id;
    }
  }
  const updated = await ViewByRoomsRepository.updateViewByRoom(id, data);

  if (updated && old_image_id) {
    await deleteFile(old_image_id);
  }

  return updated;
};

const deleteViewByRoom = async (id: string) => {
  const deleted = await ViewByRoomsRepository.deleteViewByRoom(id);
  return deleted;
};

export const ViewByRoomService = {
  addViewByRoom,
  getViewByRoomsByUser,
  getViewByRoomById,
  updateViewByRoom,
  deleteViewByRoom,
};
