import {
  TAddViewByRoomInput,
  TUpdateViewByRoomInput,
} from "../dtos/view_by_room.dtos";
import { ViewByRoomsRepository } from "../repositories/vew_by_room.repository";
import { deleteFile } from "../utils/helper/s3/deleteSingleFile";

const addViewByType = async (
  data: TAddViewByRoomInput & {
    added_by: string;
    image: string;
    image_id: string;
  }
) => {
  const savedData = await ViewByRoomsRepository.addViewByRoom(data);
  return savedData;
};

const getViewByTypeByUser = async (userId: string) => {
  const data = await ViewByRoomsRepository.getViewByRoomsByUser(userId);
  return data;
};

const getViewByTypeById = async (id: string) => {
  const data = await ViewByRoomsRepository.getViewByRoomById(id);
  return data;
};

const updateViewByType = async (
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

const deleteViewByType = async (id: string) => {
  const deleted = await ViewByRoomsRepository.deleteViewByRoom(id);

  if (deleted && deleted.image_id) {
    await deleteFile(deleted.image_id);
  }

  return deleted;
};

export const ViewByTypeService = {
  addViewByType,
  getViewByTypeByUser,
  getViewByTypeById,
  updateViewByType,
  deleteViewByType,
};
