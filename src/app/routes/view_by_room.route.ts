import { Router } from "express";
import { auth } from "../middleware/auth/auth";
import { ViewByRoomController } from "../controller/view_by_room.controller";
import { upload } from "../middleware/multer/multer_with_s3";
import { parseDataField } from "../middleware/parseData";

const router = Router();

router.post(
  "/add",
  auth(["user"]),
  upload.single("file"),
  parseDataField("data"),
  ViewByRoomController.addRoom
);

router.post(
  "/add-item",
  auth(["user"]),
  upload.single("file"),
  parseDataField("data"),
  ViewByRoomController.additemToRoom
);

router.get("/all", auth(["user"]), ViewByRoomController.getAllRoom);

router.get("/:room_id", auth(["user"]), ViewByRoomController.getRoomById);

router.patch(
  "/update-item-details/:room_item_id",
  auth(["user"]),
  upload.single("file"),
  parseDataField("data"),
  ViewByRoomController.updateItemOfRoom
);

router.patch(
  "/:room_id",
  auth(["user"]),
  upload.single("file"),
  parseDataField("data"),
  ViewByRoomController.updateRoomById
);

router.delete(
  "/delete-room-item/:room_item_id",
  auth(["user"]),
  ViewByRoomController.deleteRoomItem
);

export const ViewByRoomRoute = router;
