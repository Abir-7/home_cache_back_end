import { Router } from "express";

import { upload } from "../middleware/multer/multer_with_s3";
import { parseDataField } from "../middleware/parseData";
import { auth } from "../middleware/auth/auth";
import { ViewByTypeController } from "../controller/vew_by_types.controller";
import { validateBody } from "../middleware/zodValidator";
import { ViewByTypeZodSchema } from "../dtos/view_by_type.dto";

const router = Router();

router.post(
  "/",
  auth(["user"]),
  upload.single("file"),
  parseDataField("data"),
  validateBody(ViewByTypeZodSchema),
  ViewByTypeController.addViewByType
);

// --------------------
// Get views by user
// GET /view-by-rooms/user/:userId
router.get("/", auth(["user"]), ViewByTypeController.getViewByTypeByUser);

// --------------------
// Get view by ID
// GET /view-by-rooms/:id
router.get("/:type_id", ViewByTypeController.getViewByTypeById);

// --------------------
// Update view by ID
// PUT /view-by-rooms/:id
router.patch(
  "/:type_id",
  auth(["user"]),
  upload.single("file"),
  parseDataField("data"),
  ViewByTypeController.updateViewByType
);

// --------------------
// Delete view by ID
// DELETE /view-by-rooms/:id
router.delete("/:id", ViewByTypeController.deleteViewByType);

export const ViewByTypeRoute = router;
