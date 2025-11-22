import { Request, Response } from "express";
import catchAsync from "../utils/serverTools/catchAsync";
import { AppError } from "../utils/serverTools/AppError";
import sendResponse from "../utils/serverTools/sendResponse";
import { HomeMemberService } from "../services/home_member.service";

const searchMember = catchAsync(
  async (req: Request, res: Response) => {
    const { search_term } = req.params;

 

    const result =await HomeMemberService.serachMember(search_term);

    sendResponse(res, {
      success: true,
      message: "Member fetched successfully",
      status_code: 200,
      data: result,
    });
  }
);

const sendInvite=catchAsync(
  async (req: Request, res: Response) => {
    const { receiver_id } = req.body;

    const result = await HomeMemberService.inviteUser(req.user.user_id,receiver_id)

    sendResponse(res, {
      success: true,
      message: "Member fetched successfully",
      status_code: 200,
      data: result,
    });
  }
);

const acceptRequest=catchAsync(
  async (req: Request, res: Response) => {
    const { invite_id } = req.body;

    const result = await HomeMemberService.acceptInviteStatus( invite_id ,req.user.user_id)

    sendResponse(res, {
      success: true,
      message: "Member fetched successfully",
      status_code: 200,
      data: result,
    });
  }
);


const rejectRequest=catchAsync(
  async (req: Request, res: Response) => {
    const { invite_id } = req.body;

    const result = await HomeMemberService.rejectInviteStatus(invite_id,req.user.user_id)

    sendResponse(res, {
      success: true,
      message: "Member fetched successfully",
      status_code: 200,
      data: result,
    });
  }
);

const leave=catchAsync(
  async (req: Request, res: Response) => {
    const result = await HomeMemberService.leaveAsHomeMember(req.user.user_id)
    sendResponse(res, {
      success: true,
      message: "Member fetched successfully",
      status_code: 200,
      data: result,
    });
  }
);


export const HomememberController={
    searchMember,sendInvite,acceptRequest,rejectRequest,leave
}