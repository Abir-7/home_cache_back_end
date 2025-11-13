import { S3Client } from "@aws-sdk/client-s3";
import { appConfig } from "../../config/appConfig";

export const s3Client = new S3Client({
  region: appConfig.aws.s3.region,
  credentials: {
    accessKeyId: appConfig.aws.s3.accessKeyId!,
    secretAccessKey: appConfig.aws.s3.secretAccessKey!,
  },
  endpoint: appConfig.aws.s3.endpoint || undefined, // undefined if empty for AWS
  forcePathStyle: appConfig.aws.s3.forcePathStyle === true, // boolean
});
