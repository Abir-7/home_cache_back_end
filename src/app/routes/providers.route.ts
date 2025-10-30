import { Router } from "express";
import { upload } from "../middleware/multer/multer";
import { ProviderController } from "../controller/provider.controller";
import { parseDataField } from "../middleware/parseData";
import { auth } from "../middleware/auth/auth";

const router = Router();

router.post(
  "/",
  auth(["user"]),
  upload.array("files"),
  parseDataField("data"),
  ProviderController.createProvider
);

export const ProviderRoute = router;
