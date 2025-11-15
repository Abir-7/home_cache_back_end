import { Request, Response } from "express";
import catchAsync from "../utils/serverTools/catchAsync";
import { ViewByRoomService } from "../services/vew_by_room.service";
import sendResponse from "../utils/serverTools/sendResponse";

// --------------------
// Add View By Room
// --------------------
const addViewByRoom = catchAsync(async (req: Request, res: Response) => {
  const file = req.file as Express.MulterS3.File;
  const image = file.location;
  const image_id = file.key;
  const result = await ViewByRoomService.addViewByRoom({
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
const getViewByRoomsByUser = catchAsync(async (req: Request, res: Response) => {
  const result = await ViewByRoomService.getViewByRoomsByUser(req.user.user_id);

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
const getViewByRoomById = catchAsync(async (req: Request, res: Response) => {
  const { room_id } = req.params;
  const result = await ViewByRoomService.getViewByRoomById(room_id);

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
const updateViewByRoom = catchAsync(async (req: Request, res: Response) => {
  const { room_id } = req.params;

  const file = req.file as Express.MulterS3.File;
  const image = file.location;
  const image_id = file.key;

  const result = await ViewByRoomService.updateViewByRoom(room_id, {
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
const deleteViewByRoom = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ViewByRoomService.deleteViewByRoom(id);

  sendResponse(res, {
    success: true,
    message: "View deleted successfully",
    status_code: 200,
    data: result,
  });
});

export const ViewByRoomController = {
  addViewByRoom,
  getViewByRoomsByUser,
  getViewByRoomById,
  updateViewByRoom,
  deleteViewByRoom,
};
