import { s3Client } from "../../../common/s3";
import { DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { appConfig } from "../../../config/appConfig";
export async function deleteFile(key: string) {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: appConfig.aws.s3.bucket!,
        Key: key, // e.g. "uploads/1763026590139-wp2844478-minecraft-funny-wallpapers.jpg"
      })
    );
    console.log(`✅ File deleted: ${key}`);
  } catch (error) {
    console.error("❌ Error deleting file:", error);
  }
}
