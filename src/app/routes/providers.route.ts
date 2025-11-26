import { Router } from "express";

import { ProviderController } from "../controller/provider.controller";
import { parseDataField } from "../middleware/parseData";
import { auth } from "../middleware/auth/auth";
import { upload } from "../middleware/multer/multer_with_s3";

const router = Router();

router.post(
  "/",
  auth(["user"]),
  upload.array("files", 5),
  parseDataField("data"),
  ProviderController.createProvider
);

router.post(
  "/toogle-follow",
  auth(["user"]),
  ProviderController.toogleProviderFollow
);

router.patch(
  "/:provider_id",
  auth(["user"]),
  upload.array("files", 5),
  parseDataField("data"),
  ProviderController.updateProvider
);

router.get("/", auth(["user"]), ProviderController.getAllProviders);

router.get("/:provider_id", auth(["user"]), ProviderController.getProviderById);

export const ProviderRoute = router;
