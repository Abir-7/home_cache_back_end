import { Router } from "express";
import { auth } from "../middleware/auth/auth";
import { parseDataField } from "../middleware/parseData";

import { DocumentController } from "../controller/document.controller";
import { upload } from "../middleware/multer/multer_with_s3";

const router = Router();

router.post(
  "/",
  auth(["user"]),
  upload.array("files", 5),
  parseDataField("data"),
  DocumentController.saveNewDocument
);
router.get(
  "/",
  auth(["user"]),

  DocumentController.getAllDocument
);
router.get(
  "/:document_id",
  auth(["user"]),
  DocumentController.getSingleDocument
);
router.delete(
  "/:document_id",
  auth(["user"]),
  DocumentController.deleteSingleDocument
);
export const DocumentRoute = router;
