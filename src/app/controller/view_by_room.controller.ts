import { Request, Response } from "express";
import catchAsync from "../utils/serverTools/catchAsync";
import { ViewByRoomService } from "../services/view_by_room.service";
import sendResponse from "../utils/serverTools/sendResponse";

const addRoom = catchAsync(async (req: Request, res: Response) => {
  const file = req.file as Express.MulterS3.File | undefined;

  let data = {
    ...req.body,
    added_by: req.user.user_id,
  };

  if (file) {
    data = {
      ...data,
      image_id: file.key,
      image: file.location,
    };
  }

  const result = await ViewByRoomService.addRoom(data);

  sendResponse(res, {
    success: true,
    message: "Room added successfully",
    status_code: 200,
    data: result,
  });
});

const getAllRoom = catchAsync(async (req: Request, res: Response) => {
  const result = await ViewByRoomService.getAllRoom(req.user.user_id);

  sendResponse(res, {
    success: true,
    message: "All Room fetched successfully",
    status_code: 200,
    data: result,
  });
});

const getRoomById = catchAsync(async (req: Request, res: Response) => {
  const result = await ViewByRoomService.getRoomById(
    req.user.user_id,
    req.params.room_id
  );

  sendResponse(res, {
    success: true,
    message: "Room details fetched successfully",
    status_code: 200,
    data: result,
  });
});

const updateRoomById = catchAsync(async (req: Request, res: Response) => {
  const file = req.file as Express.MulterS3.File | undefined;

  let data = {
    ...req.body,
  };

  if (file) {
    data = {
      ...data,
      image_id: file.key,
      image: file.location,
    };
  }

  const result = await ViewByRoomService.updateRoomById(
    req.user.user_id,
    req.params.room_id,
    data
  );

  sendResponse(res, {
    success: true,
    message: "Room details fetched successfully",
    status_code: 200,
    data: result,
  });
});

const additemToRoom = catchAsync(async (req: Request, res: Response) => {
  const file = req.file as Express.MulterS3.File | undefined;

  let data = {
    ...req.body,
  };

  if (file) {
    data = {
      ...data,
      image_id: file.key,
      image: file.location,
    };
  }

  const result = await ViewByRoomService.addItemToRoom(data);

  sendResponse(res, {
    success: true,
    message: "Room item  added successfully",
    status_code: 200,
    data: result,
  });
});

const updateItemOfRoom = catchAsync(async (req: Request, res: Response) => {
  const file = req.file as Express.MulterS3.File | undefined;

  let data = {
    ...req.body,
  };

  if (file) {
    data = {
      ...data,
      image_id: file.key,
      image: file.location,
    };
  }

  const result = await ViewByRoomService.updateRoomItem(
    data,
    req.params.room_item_id
  );

  sendResponse(res, {
    success: true,
    message: "Room item  added successfully",
    status_code: 200,
    data: result,
  });
});

const deleteRoomItem = catchAsync(async (req: Request, res: Response) => {
  const result = await ViewByRoomService.deleteRoomItem(
    req.params.room_item_id
  );

  sendResponse(res, {
    success: true,
    message: "Room item deleted successfully",
    status_code: 200,
    data: result,
  });
});

export const ViewByRoomController = {
  addRoom,
  getAllRoom,
  getRoomById,
  updateRoomById,
  additemToRoom,
  updateItemOfRoom,
  deleteRoomItem,
};
