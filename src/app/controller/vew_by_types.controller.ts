import { Request, Response } from "express";
import catchAsync from "../utils/serverTools/catchAsync";

import sendResponse from "../utils/serverTools/sendResponse";
import { ViewByTypeService } from "../services/view_by_types.service";

// --------------------
// Add View By Room
// --------------------
const addViewByType = catchAsync(async (req: Request, res: Response) => {
  const file = req.file as Express.MulterS3.File;
  const image = file.location;
  const image_id = file.key;
  const result = await ViewByTypeService.addViewByType({
    ...req.body,
    added_by: req.user.user_id,
    image,
    image_id,
  });

  sendResponse(res, {
    success: true,
    message: "View by romm data added successfully",
    status_code: 200,
    data: result,
  });
});

// --------------------
// Get Views by User
// --------------------
const getViewByTypeByUser = catchAsync(async (req: Request, res: Response) => {
  const result = await ViewByTypeService.getViewByTypeByUser(req.user.user_id);

  sendResponse(res, {
    success: true,
    message: "User views fetched successfully",
    status_code: 200,
    data: result,
  });
});

// --------------------
// Get View By ID
// --------------------
const getViewByTypeById = catchAsync(async (req: Request, res: Response) => {
  const { type_id } = req.params;
  const result = await ViewByTypeService.getViewByTypeById(type_id);

  sendResponse(res, {
    success: true,
    message: "View fetched successfully",
    status_code: 200,
    data: result,
  });
});

// --------------------
// Update View By Room
// --------------------
const updateViewByType = catchAsync(async (req: Request, res: Response) => {
  const { type_id } = req.params;

  const file = req.file as Express.MulterS3.File;
  const image = file.location;
  const image_id = file.key;

  const result = await ViewByTypeService.updateViewByType(type_id, {
    ...req.body,
    image,
    image_id,
  });

  sendResponse(res, {
    success: true,
    message: "View updated successfully",
    status_code: 200,
    data: result,
  });
});

// --------------------
// Delete View By Room
// --------------------
const deleteViewByType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ViewByTypeService.deleteViewByType(id);

  sendResponse(res, {
    success: true,
    message: "View deleted successfully",
    status_code: 200,
    data: result,
  });
});

export const ViewByTypeController = {
  addViewByType,
  getViewByTypeByUser,
  getViewByTypeById,
  updateViewByType,
  deleteViewByType,
};
