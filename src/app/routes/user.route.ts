import { Router } from "express";
import { auth } from "../middleware/auth/auth";
import { UserController } from "../controller/user.controller";
import { upload } from "../middleware/multer/multer_with_s3";
import { parseDataField } from "../middleware/parseData";

const router = Router();
router.get("/me", auth(["user"]), UserController.getMyData);
router.patch(
  "/update_home_data",
  auth(["user"]),
  UserController.updateHomeDataOfUser
);
router.patch(
  "/update_profile",
  auth(["user"]),
  upload.single("file"),
  parseDataField("data"),
  UserController.updateUser
);
export const UserRoute = router;
