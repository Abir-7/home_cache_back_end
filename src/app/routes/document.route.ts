import { Router } from "express";
import { auth } from "../middleware/auth/auth";
import { parseDataField } from "../middleware/parseData";

import { upload } from "../middleware/multer/multer_with_s3";
import { DocumentController } from "../controller/document.controller";

const router = Router();

router.post(
  "/",
  auth(["user"]),
  upload.array("files", 5),
  parseDataField("data"),
  DocumentController.createDocumentWithDetails
);
router.get(
  "/all",
  auth(["user"]),
  DocumentController.getAllDocumentWithDetails
);

router.get(
  "/:doc_id",
  auth(["user"]),
  DocumentController.getSingleDocumentWithDetails
);

export const DocumentRoute = router;
