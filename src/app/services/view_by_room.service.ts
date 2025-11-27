import { TAddViewByRoomItemDetailsInput } from "../dtos/room_item_details.dto";
import { TViewByRoomDto } from "../dtos/view_by_room.dtos";
import { Repository } from "../repositories/helper.repository";
import { RoomItemRepository } from "../repositories/room_item.repository";
import { RoomItemDetailsRepository } from "../repositories/room_item_details.repository";
import { ViewByRoomRepository } from "../repositories/view_by_room.repository";
import { capitalizeFirstLetter } from "../utils/helper/capitalizeFirstLetter";
import { deleteFile } from "../utils/helper/s3/deleteSingleFile";
import { AppError } from "../utils/serverTools/AppError";

const addRoom = async (
  data: TViewByRoomDto & { image_id: string; image: string }
) => {
  const { item, ...rest } = data;

  const get_type = await ViewByRoomRepository.getRoomTypeById(rest.type_id);

  if (!get_type) {
    throw new AppError("Type not found.");
  }

  const get_user_room_number =
    await ViewByRoomRepository.get_user_same_room_amount(
      data.added_by,
      data.type_id
    );

  return Repository.transaction(async (tx) => {
    const saved_data = await ViewByRoomRepository.addRoom(
      {
        ...rest,

        room_name: `${capitalizeFirstLetter(get_type.type)}${
          get_user_room_number > 0 ? ` ${get_user_room_number}` : ""
        }`,
      },
      tx
    );

    const item_data = item.map((i) => ({
      room_id: saved_data.id,
      item: i,
    }));

    const saved_item = await RoomItemRepository.addRoomItem(item_data, tx);

    const save_item_details_data = saved_item.map((i) => ({
      room_id: i.room_id,
      room_item_id: i.id,
    }));
    const save_item_details =
      await RoomItemDetailsRepository.addRoomItemDetails(
        save_item_details_data,
        tx
      );
    return { room: saved_data, item: saved_item, save_item_details };
  });
};

const getAllRoom = async (user_id: string) => {
  const saved_data = await ViewByRoomRepository.getAllRoom(user_id);
  return saved_data;
};

const getRoomById = async (user_id: string, room_id: string) => {
  const saved_data = await ViewByRoomRepository.getRoomById(room_id, user_id);
  return saved_data;
};

const updateRoomById = async (
  user_id: string,
  room_id: string,
  data: Partial<TViewByRoomDto & { image_id: string }>
) => {
  const saved_data = await ViewByRoomRepository.updateRoomById(
    room_id,
    user_id,
    data
  );

  if (data.image_id) {
    await deleteFile(data.image_id);
  }

  return saved_data;
};

const addItemToRoom = async (
  data: TAddViewByRoomItemDetailsInput & { item: string; room_id: string }
) => {
  const { item, room_id, ...rest } = data;
  const room_item = { item, room_id };
  return await Repository.transaction(async (tx) => {
    const saved = await RoomItemRepository.addRoomItem(room_item, tx);

    await RoomItemDetailsRepository.addRoomItemDetails(
      {
        ...rest,
        room_id,
        room_item_id: saved[0].id,
      },
      tx
    );

    return saved[0];
  });
};

const updateRoomItem = async (
  data: TAddViewByRoomItemDetailsInput & { image_id: string },
  room_item_id: string
) => {
  const updated_data = await RoomItemDetailsRepository.editRoomItemDetails(
    data,
    room_item_id
  );

  if (!updated_data) {
    throw new AppError("Failed to update data.", 400);
  }

  return updated_data;
};

const deleteRoomItem = async (room_item_id: string) => {
  const deleted_data = await RoomItemRepository.deleteItem(room_item_id);

  return deleted_data;
};

//=== Room type ===

const addRoomType = async (data: {
  type: string;
  image: string;
  image_id: string;
}) => {
  const saved_data = await ViewByRoomRepository.addRoomType(data);
  return saved_data;
};

const getAllRoomType = async () => {
  const saved_data = await ViewByRoomRepository.getAllRoomType();
  return saved_data;
};

export const ViewByRoomService = {
  addRoom,
  getAllRoom,
  getRoomById,
  updateRoomById,
  addItemToRoom,
  updateRoomItem,
  deleteRoomItem,
  addRoomType,
  getAllRoomType,
};
