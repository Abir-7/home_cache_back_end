import { TViewByTypesType } from "../dtos/view_by_type.dto";

import { ViewByTypesRepository } from "../repositories/vew_by_type.repository";
import { deleteFile } from "../utils/helper/s3/deleteSingleFile";

const addViewByType = async (
  data: TViewByTypesType & {
    added_by: string;
    image: string;
    image_id: string;
  }
) => {
  const savedData = await ViewByTypesRepository.addViewByType(data);
  return savedData;
};

const getViewByTypeByUser = async (userId: string) => {
  const data = await ViewByTypesRepository.getViewByTypeByUser(userId);
  return data;
};

const getViewByTypeById = async (id: string) => {
  const data = await ViewByTypesRepository.getViewByTypeById(id);
  return data;
};

const updateViewByType = async (
  id: string,
  data: Partial<
    TViewByTypesType & {
      image?: string;
      image_id?: string;
    }
  >
) => {
  let old_image_id = null;
  if (data.image && data.image_id) {
    const old_data = await ViewByTypesRepository.getViewByTypeById(id);

    if (old_data && old_data.image_id) {
      old_image_id = old_data.image_id;
    }
  }
  const updated = await ViewByTypesRepository.updateViewByType(id, data);

  if (updated && old_image_id) {
    await deleteFile(old_image_id);
  }

  return updated;
};

const deleteViewByType = async (id: string) => {
  const deleted = await ViewByTypesRepository.deleteViewByType(id);

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
