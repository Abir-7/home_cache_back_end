import { NodePgDatabase } from "drizzle-orm/node-postgres";
// -------------------------
// MAIN DOCUMENT
// -------------------------

import { desc, eq } from "drizzle-orm";
import { db, schema } from "../db";
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
  data: typeof Documents.$inferInsert,
  tx?: NodePgDatabase<typeof schema>
): Promise<(typeof Documents.$inferSelect)[]> => {
  const client = tx ?? db;
  const created = await client.insert(Documents).values(data).returning();
  return created;
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
  data: typeof WarrantyDocuments.$inferInsert,
  tx?: NodePgDatabase<typeof schema>
): Promise<(typeof WarrantyDocuments.$inferSelect)[]> => {
  const client = tx ?? db;
  const warranty = await client
    .insert(WarrantyDocuments)
    .values(data)
    .returning();
  return warranty;
};

// -------------------------
// INSURANCE
// -------------------------

const createInsurance = async (
  data: typeof InsuranceDocuments.$inferInsert,
  tx?: NodePgDatabase<typeof schema>
): Promise<(typeof InsuranceDocuments.$inferSelect)[]> => {
  const client = tx ?? db;
  const insurance = await client
    .insert(InsuranceDocuments)
    .values(data)
    .returning();
  return insurance;
};

// -------------------------
// RECEIPT
// -------------------------

const createReceipt = async (
  data: typeof ReceiptDocuments.$inferInsert,
  tx?: NodePgDatabase<typeof schema>
): Promise<(typeof ReceiptDocuments.$inferSelect)[]> => {
  const client = tx ?? db;
  return await client.insert(ReceiptDocuments).values(data).returning();
};

// -------------------------
// QUOTE
// -------------------------

const createQuote = async (
  data: typeof QuoteDocuments.$inferInsert,
  tx?: NodePgDatabase<typeof schema>
): Promise<(typeof QuoteDocuments.$inferSelect)[]> => {
  const client = tx ?? db;
  return await client.insert(QuoteDocuments).values(data).returning();
};

// -------------------------
// MANUAL
// -------------------------

const createManual = async (
  data: typeof ManualDocuments.$inferInsert,
  tx?: NodePgDatabase<typeof schema>
): Promise<(typeof ManualDocuments.$inferSelect)[]> => {
  const client = tx ?? db;
  return await client.insert(ManualDocuments).values(data).returning();
};

// -------------------------
// OTHER
// -------------------------

const createOther = async (
  data: typeof OtherDocuments.$inferInsert,
  tx?: NodePgDatabase<typeof schema>
): Promise<(typeof OtherDocuments.$inferSelect)[]> => {
  const client = tx ?? db;
  return await client.insert(OtherDocuments).values(data).returning();
};

const getAllDocumentsWithDetails = async (
  user_ids: string[],
  type?: string
) => {
  // Build base query
  const documents = await db.query.Documents.findMany({
    where: (fields, { eq, inArray, and }) => {
      const conditions: any[] = [inArray(fields.added_by, user_ids)];
      if (type) conditions.push(eq(fields.type as any, type));
      return and(...conditions);
    },
    orderBy: [desc(Documents.created_at)],
  });

  if (!documents.length) return [];

  // -----------------------
  // Preload all detail tables using `with` (single queries per type)
  // -----------------------
  const warrantyDocs = await db.query.WarrantyDocuments.findMany({
    where: (fields, { inArray }) =>
      inArray(
        fields.document_id,
        documents.filter((d) => d.type === "warranty").map((d) => d.id)
      ),
  });

  const insuranceDocs = await db.query.InsuranceDocuments.findMany({
    where: (fields, { inArray }) =>
      inArray(
        fields.document_id,
        documents.filter((d) => d.type === "insurance").map((d) => d.id)
      ),
  });

  const receiptDocs = await db.query.ReceiptDocuments.findMany({
    where: (fields, { inArray }) =>
      inArray(
        fields.document_id,
        documents.filter((d) => d.type === "receipt").map((d) => d.id)
      ),
  });

  const quoteDocs = await db.query.QuoteDocuments.findMany({
    where: (fields, { inArray }) =>
      inArray(
        fields.document_id,
        documents.filter((d) => d.type === "quote").map((d) => d.id)
      ),
  });

  const manualDocs = await db.query.ManualDocuments.findMany({
    where: (fields, { inArray }) =>
      inArray(
        fields.document_id,
        documents.filter((d) => d.type === "manual").map((d) => d.id)
      ),
  });

  const otherDocs = await db.query.OtherDocuments.findMany({
    where: (fields, { inArray }) =>
      inArray(
        fields.document_id,
        documents.filter((d) => d.type === "other").map((d) => d.id)
      ),
  });

  // -----------------------
  // Combine main document + detail
  // -----------------------
  return documents.map((doc) => {
    let detail = null;

    switch (doc.type) {
      case "warranty":
        detail = warrantyDocs.find((d) => d.document_id === doc.id);
        break;
      case "insurance":
        detail = insuranceDocs.find((d) => d.document_id === doc.id);
        break;
      case "receipt":
        detail = receiptDocs.find((d) => d.document_id === doc.id);
        break;
      case "quote":
        detail = quoteDocs.find((d) => d.document_id === doc.id);
        break;
      case "manual":
        detail = manualDocs.find((d) => d.document_id === doc.id);
        break;
      case "other":
        detail = otherDocs.find((d) => d.document_id === doc.id);
        break;
    }

    return {
      ...doc,
      details: detail ?? {},
    };
  });
};

const getSingleDocumentWithDetails = async (documentId: string) => {
  // 1️⃣ Fetch main document
  const doc = await db.query.Documents.findFirst({
    where: eq(Documents.id, documentId),
  });

  if (!doc) return null;

  // 2️⃣ Fetch details based on document type
  let details: any = null;

  switch (doc.type) {
    case "warranty":
      details = await db.query.WarrantyDocuments.findFirst({
        where: eq(WarrantyDocuments.document_id, doc.id),
      });
      break;

    case "insurance":
      details = await db.query.InsuranceDocuments.findFirst({
        where: eq(InsuranceDocuments.document_id, doc.id),
      });
      break;

    case "receipt":
      details = await db.query.ReceiptDocuments.findFirst({
        where: eq(ReceiptDocuments.document_id, doc.id),
      });
      break;

    case "quote":
      details = await db.query.QuoteDocuments.findFirst({
        where: eq(QuoteDocuments.document_id, doc.id),
      });
      break;

    case "manual":
      details = await db.query.ManualDocuments.findFirst({
        where: eq(ManualDocuments.document_id, doc.id),
      });
      break;

    case "other":
      details = await db.query.OtherDocuments.findFirst({
        where: eq(OtherDocuments.document_id, doc.id),
      });
      break;

    default:
      throw new Error("Invalid document type");
  }

  return {
    ...doc,
    details,
  };
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
  getAllDocumentsWithDetails,
  getSingleDocumentWithDetails,
};
