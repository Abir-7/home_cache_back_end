import { Router } from "express";
import { auth } from "../middleware/auth/auth";
import { TaskController } from "../controller/task.controller";

const router = Router();

router.post("/add_task", auth(["user"]), TaskController.addNewTask);
router.get("/get_users_task", auth(["user"]), TaskController.userTask);

router.patch(
  "/assign_member_to_a_task",
  auth(["user"]),
  TaskController.assignedMember
);
router.get(
  "/home-task-data",
  auth(["user"]),
  TaskController.usersHomeTaskDetails
);

router.get(
  "/task_notification",
  auth(["user"]),
  TaskController.getTaskNotification
);
router.patch(
  "/mark_as_done_or_ignore",
  auth(["user"]),
  TaskController.update_task_status
);

router.get(
  "/task_details/:task_id",
  auth(["user"]),
  TaskController.taskDetails
);

export const TaskRoute = router;
