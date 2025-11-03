import { eq, ilike } from "drizzle-orm";
import { db } from "../db";

import { Documents } from "../schema/documents.schema";

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

export const DocumentRepository = {
  addNewDocument,
  getAllDocument,
  getSingleDocument,
};
