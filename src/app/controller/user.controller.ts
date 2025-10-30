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

export const UserController = { updateHomeDataOfUser };
