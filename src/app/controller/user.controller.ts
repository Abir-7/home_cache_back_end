import { Request, Response } from "express";
import catchAsync from "../utils/serverTools/catchAsync";
import sendResponse from "../utils/serverTools/sendResponse";
import { UserServce } from "../services/user.service";

const updateHomeDataOfUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServce.updateHomeDataOfUser(
    req.user.user_id,
    req.body
  );
  sendResponse(res, {
    success: true,
    message: "Users home data updated successfully",
    status_code: 200,
    data: result,
  });
});

const getMyData = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServce.getMyData(req.user.user_id);
  sendResponse(res, {
    success: true,
    message: "Users info fetched successfully",
    status_code: 200,
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const file = req.file as Express.MulterS3.File;
  const data = req.body;
  if (file.key) {
    data.image = file.location;
    data.image_id = file.key;
  }
  const result = await UserServce.updateUser(req.user.user_id, data);
  sendResponse(res, {
    success: true,
    message: "Users updated successfully",
    status_code: 200,
    data: result,
  });
});

export const UserController = { updateHomeDataOfUser, getMyData, updateUser };
