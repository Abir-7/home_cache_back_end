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

router.patch(
  "/:provider_id",
  auth(["user"]),
  upload.array("files"),
  parseDataField("data"),
  ProviderController.updateProvider
);

router.get(
  "/",
  auth(["user"]),
  ProviderController.getAllProviders
);

router.get(
  "/:provider_id",
  auth(["user"]),
  ProviderController.getProviderById
);

export const ProviderRoute = router;
