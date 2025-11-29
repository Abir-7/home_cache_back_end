import { Request, Response } from "express";
import { TaskService } from "../services/task.service";
import catchAsync from "../utils/serverTools/catchAsync";
import sendResponse from "../utils/serverTools/sendResponse";
import { TaskFilter } from "../dtos/task.dtos";

const addNewTask = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.addTask(req.user.user_id, req.body);

  sendResponse(res, {
    success: true,
    message: "New task added successfully",
    status_code: 200,
    data: result,
  });
});

const assignedMember = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.assignMember(req.body);

  sendResponse(res, {
    success: true,
    message: "Member assigned successfully",
    status_code: 200,
    data: result,
  });
});

const userTask = catchAsync(async (req: Request, res: Response) => {
  console.log("hit");
  const result = await TaskService.usersTask(
    req.user.user_id,
    req.query.task_time as TaskFilter
  );
  console.log(req.user.user_id);
  sendResponse(res, {
    success: true,
    message: "Task list fetched successfully",
    status_code: 200,
    data: result,
  });
});

const taskDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.taskDetails(req.params.task_id);

  sendResponse(res, {
    success: true,
    message: "Task details fetched successfully",
    status_code: 200,
    data: result,
  });
});

const getTaskNotification = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.getTaskNotification(req.user.user_id);

  sendResponse(res, {
    success: true,
    message: "Task notification fetched successfully",
    status_code: 200,
    data: result,
  });
});

const update_task_status = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.update_task_status(req.body);

  sendResponse(res, {
    success: true,
    message: "Task status updated successfully",
    status_code: 200,
    data: result,
  });
});

const usersHomeTaskDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.usersHomeTaskDetails(req.user.user_id);

  sendResponse(res, {
    success: true,
    message: "Home task data fetched successfully",
    status_code: 200,
    data: result,
  });
});

export const TaskController = {
  addNewTask,
  assignedMember,
  userTask,
  taskDetails,
  getTaskNotification,
  update_task_status,
  usersHomeTaskDetails,
};
