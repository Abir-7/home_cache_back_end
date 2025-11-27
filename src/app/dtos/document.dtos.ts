import z from "zod";
import {
  Documents,
  InsuranceDocuments,
  ManualDocuments,
  OtherDocuments,
  QuoteDocuments,
  ReceiptDocuments,
  WarrantyDocuments,
} from "../schema/documents.schema";

// Schema for a single file object
export const FileSchema = z.object({
  file_url: z.string().min(1),
  file_id: z.string().min(1),
});

// Schema for the full document
export const NewDocumentSchema = z.object({
  id: z.string().optional(),
  type: z.string().min(1),
  title: z.string().min(1),
  brand: z.string().min(1),
  url: z.string().min(1),
  exp_date: z.date().optional(),
  note: z.string().min(1),
});
export type TNewDocument = z.infer<typeof NewDocumentSchema>;
export type TFile = z.infer<typeof FileSchema>;

// -----------------------------
// MAIN DOCUMENT
// -----------------------------
export type TDocumentInsert = typeof Documents.$inferInsert;
export type TDocument = typeof Documents.$inferSelect;

// -----------------------------
// WARRANTY
// -----------------------------
export type TWarrantyInsert = typeof WarrantyDocuments.$inferInsert;
export type TWarranty = typeof WarrantyDocuments.$inferSelect;

// -----------------------------
// INSURANCE
// -----------------------------
export type TInsuranceInsert = typeof InsuranceDocuments.$inferInsert;
export type TInsurance = typeof InsuranceDocuments.$inferSelect;

// -----------------------------
// RECEIPT
// -----------------------------
export type TReceiptInsert = typeof ReceiptDocuments.$inferInsert;
export type TReceipt = typeof ReceiptDocuments.$inferSelect;

// -----------------------------
// QUOTE
// -----------------------------
export type TQuoteInsert = typeof QuoteDocuments.$inferInsert;
export type TQuote = typeof QuoteDocuments.$inferSelect;

// -----------------------------
// MANUAL
// -----------------------------
export type TManualInsert = typeof ManualDocuments.$inferInsert;
export type TManual = typeof ManualDocuments.$inferSelect;

// -----------------------------
// OTHER
// -----------------------------
export type TOtherInsert = typeof OtherDocuments.$inferInsert;
export type TOther = typeof OtherDocuments.$inferSelect;

// -----------------------------
// CREATE DOCUMENT PAYLOAD
// -----------------------------
export type TCreateDocumentPayload = {
  main: TDocumentInsert;
  details:
    | TWarrantyInsert
    | TInsuranceInsert
    | TReceiptInsert
    | TQuoteInsert
    | TManualInsert
    | TOtherInsert;
};
