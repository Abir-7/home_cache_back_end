import { Router } from "express";
import { auth } from "../middleware/auth/auth";
import { UserController } from "../controller/user.controller";

const router = Router();
router.patch(
  "/update_home_data",
  auth(["user"]),
  UserController.updateHomeDataOfUser
);
export const UserRoute = router;
