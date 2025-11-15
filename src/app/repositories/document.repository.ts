import { eq, ilike } from "drizzle-orm";
import { db } from "../db";

import { Documents } from "../schema/documents.schema";
import { AppError } from "../utils/serverTools/AppError";
import { deleteMultipleFiles } from "../utils/helper/s3/deleteMultipleFile";

const addNewDocument = async (data: typeof Documents.$inferInsert) => {
  const [saved_document] = await db.insert(Documents).values(data).returning();

  return saved_document;
};
const getAllDocument = async (type: string) => {
  const saved_document = await db.query.Documents.findMany({
    where: ilike(Documents.type, type),
  });

  return saved_document;
};
const getSingleDocument = async (document_id: string) => {
  const saved_document = await db.query.Documents.findFirst({
    where: eq(Documents.id, document_id),
  });

  return saved_document;
};
const deleteSingleDocument = async (document_id: string) => {
  const [deleted_document] = await db
    .delete(Documents)
    .where(eq(Documents.id, document_id))
    .returning();

  if (!deleted_document) {
    throw new AppError("Document not found");
  }

  const document_key = deleted_document.files.map((file) => file.file_id);

  if (document_key.length > 0) {
    await deleteMultipleFiles(document_key);
  }

  return deleted_document.id;
};

export const DocumentRepository = {
  addNewDocument,
  getAllDocument,
  getSingleDocument,
  deleteSingleDocument,
};
