// -------------------------
// MAIN DOCUMENT
// -------------------------

import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  Documents,
  InsuranceDocuments,
  ManualDocuments,
  OtherDocuments,
  QuoteDocuments,
  ReceiptDocuments,
  WarrantyDocuments,
} from "../schema/documents.schema";

const createDocument = async (
  data: typeof Documents.$inferInsert
): Promise<(typeof Documents.$inferSelect)[]> => {
  return await db.insert(Documents).values(data).returning();
};

const getDocumentById = async (id: string) => {
  const saved_data = await db.query.Documents.findFirst({
    where: eq(Documents.id, id),
  });
  return saved_data;
};

const deleteDocument = async (
  id: string
): Promise<(typeof Documents.$inferSelect)[]> => {
  return await db.delete(Documents).where(eq(Documents.id, id)).returning();
};

// -------------------------
// WARRANTY
// -------------------------

const createWarranty = async (
  data: typeof WarrantyDocuments.$inferInsert
): Promise<(typeof WarrantyDocuments.$inferSelect)[]> => {
  return await db.insert(WarrantyDocuments).values(data).returning();
};

// -------------------------
// INSURANCE
// -------------------------

const createInsurance = async (
  data: typeof InsuranceDocuments.$inferInsert
): Promise<(typeof InsuranceDocuments.$inferSelect)[]> => {
  return await db.insert(InsuranceDocuments).values(data).returning();
};

// -------------------------
// RECEIPT
// -------------------------

const createReceipt = async (
  data: typeof ReceiptDocuments.$inferInsert
): Promise<(typeof ReceiptDocuments.$inferSelect)[]> => {
  return await db.insert(ReceiptDocuments).values(data).returning();
};

// -------------------------
// QUOTE
// -------------------------

const createQuote = async (
  data: typeof QuoteDocuments.$inferInsert
): Promise<(typeof QuoteDocuments.$inferSelect)[]> => {
  return await db.insert(QuoteDocuments).values(data).returning();
};

// -------------------------
// MANUAL
// -------------------------

const createManual = async (
  data: typeof ManualDocuments.$inferInsert
): Promise<(typeof ManualDocuments.$inferSelect)[]> => {
  return await db.insert(ManualDocuments).values(data).returning();
};

// -------------------------
// OTHER
// -------------------------

const createOther = async (
  data: typeof OtherDocuments.$inferInsert
): Promise<(typeof OtherDocuments.$inferSelect)[]> => {
  return await db.insert(OtherDocuments).values(data).returning();
};

// -------------------------
// EXPORT REPOSITORY
// -------------------------

export const DocumentRepository = {
  createDocument,
  getDocumentById,
  deleteDocument,

  createWarranty,
  createInsurance,
  createReceipt,
  createQuote,
  createManual,
  createOther,
};
