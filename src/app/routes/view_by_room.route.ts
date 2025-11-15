import { Router } from "express";
import { ViewByRoomController } from "../controller/vew_by_room.controller";
import { upload } from "../middleware/multer/multer_with_s3";
import { parseDataField } from "../middleware/parseData";
import { auth } from "../middleware/auth/auth";

const router = Router();

router.post(
  "/",
  auth(["user"]),
  upload.single("file"),
  parseDataField("data"),
  ViewByRoomController.addViewByRoom
);

// --------------------
// Get views by user
// GET /view-by-rooms/user/:userId
router.get("/", auth(["user"]), ViewByRoomController.getViewByRoomsByUser);

// --------------------
// Get view by ID
// GET /view-by-rooms/:id
router.get("/:room_id", ViewByRoomController.getViewByRoomById);

// --------------------
// Update view by ID
// PUT /view-by-rooms/:id
router.patch(
  "/:room_id",
  auth(["user"]),
  upload.single("file"),
  parseDataField("data"),
  ViewByRoomController.updateViewByRoom
);

// --------------------
// Delete view by ID
// DELETE /view-by-rooms/:id
router.delete("/:id", ViewByRoomController.deleteViewByRoom);

export const ViewByRoomRoute = router;
