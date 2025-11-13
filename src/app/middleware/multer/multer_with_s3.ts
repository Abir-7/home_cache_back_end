import multer from "multer";
import multerS3 from "multer-s3";

import { appConfig } from "../../config/appConfig";
import { s3Client } from "../../common/s3";

export const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: appConfig.aws.s3.bucket!,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read", // optional
    key: (req, file, cb) => {
      const fileName = `uploads/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
});
