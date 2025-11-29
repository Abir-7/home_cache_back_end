import { Request, Response } from "express";
import { AiService } from "../services/ai.service";
import catchAsync from "../utils/serverTools/catchAsync";
import sendResponse from "../utils/serverTools/sendResponse";

const getResponse = catchAsync(async (req: Request, res: Response) => {
  const result = await AiService.aiResponse(
    req.user?.user_id,
    req.body.prompt as string,
    res
  );

  sendResponse(res, {
    success: true,
    message: "Ai response sent successfully.",
    status_code: 200,
    data: result,
  });
});

const get_message = catchAsync(async (req: Request, res: Response) => {
  const result = await AiService.get_message(req.user.user_id);

  sendResponse(res, {
    success: true,
    message: "Message fetched successfully.",
    status_code: 200,
    data: result,
  });
});

export const AiController = {
  getResponse,
  get_message,
};
