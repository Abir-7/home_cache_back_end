import { Router } from "express";
import { auth } from "../middleware/auth/auth";
import { parseDataField } from "../middleware/parseData";
import { upload } from "../middleware/multer/multer";
import { DocumentController } from "../controller/document.controller";

const router = Router();

router.post(
  "/",
  auth(["user"]),
  upload.array("files"),
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

export const DocumentRoute = router;
