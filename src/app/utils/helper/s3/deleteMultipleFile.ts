import { DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../../common/s3";
import { appConfig } from "../../../config/appConfig";

export async function deleteMultipleFiles(keys: string[]) {
  if (!keys.length) return;

  try {
    const objects = keys.map((key) => ({ Key: key }));

    await s3Client.send(
      new DeleteObjectsCommand({
        Bucket: appConfig.aws.s3.bucket!,
        Delete: { Objects: objects, Quiet: false },
      })
    );

    console.log(`✅ Deleted files: ${keys.join(", ")}`);
  } catch (error) {
    console.error("❌ Error deleting files:", error);
  }
}
