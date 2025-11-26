import { jsonb } from "drizzle-orm/pg-core";
import { timestamps } from "../db/helper/columns.helpers";

import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  numeric,
  pgEnum,
} from "drizzle-orm/pg-core";
import { UserProfiles } from "./user_profiles.schema";

export type File = {
  file_url: string;
  file_id: string;
};

// ----------------------
// Enum for document types
// ----------------------
export const documentTypeEnum = pgEnum("document_types", [
  "warranty",
  "insurance",
  "receipt",
  "quote",
  "manual",
  "other",
]);

// ----------------------
// Main documents table
// ----------------------
export const Documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: documentTypeEnum("type").notNull(),
  files: jsonb("files").$type<File[]>().notNull(),
  added_by: uuid("added_by")
    .references(() => UserProfiles.user_id)
    .notNull(),
  createdBy: uuid("created_by").notNull(),
  ...timestamps,
});

// ========================================================================
// WARRANTY
// ========================================================================
export const WarrantyDocuments = pgTable("warranty_documents", {
  documentId: uuid("document_id")
    .primaryKey()
    .references(() => Documents.id, { onDelete: "cascade" }),

  name: varchar("name").notNull(),
  brand: varchar("brand").notNull(),
  warrantyStartDate: date("warranty_start_date"),
  warrantyEndDate: date("warranty_end_date").notNull(),
  serialNumber: varchar("serial_number"),
  serviceContactInfo: text("service_contact_info"),
});

// ========================================================================
// INSURANCE
// ========================================================================
export const InsuranceDocuments = pgTable("insurance_documents", {
  documentId: uuid("document_id")
    .primaryKey()
    .references(() => Documents.id, { onDelete: "cascade" }),

  policyNumber: varchar("policy_number").notNull(),
  providerName: varchar("provider_name").notNull(),
  coverageStartDate: date("coverage_start_date"),
  coverageEndDate: date("coverage_end_date").notNull(),
  premiumAmount: numeric("premium_amount"),
  claimContactInfo: text("claim_contact_info"),
});

// ========================================================================
// RECEIPTS
// ========================================================================
export const ReceiptDocuments = pgTable("receipt_documents", {
  documentId: uuid("document_id")
    .primaryKey()
    .references(() => Documents.id, { onDelete: "cascade" }),

  vendorStoreName: varchar("vendor_store_name").notNull(),
  dateOfPurchase: date("date_of_purchase"),
  totalAmountPaid: numeric("total_amount_paid").notNull(),
  paymentMethod: varchar("payment_method"),
  orderNumber: varchar("order_number"),
});

// ========================================================================
// QUOTES
// ========================================================================
export const QuoteDocuments = pgTable("quote_documents", {
  documentId: uuid("document_id")
    .primaryKey()
    .references(() => Documents.id, { onDelete: "cascade" }),

  serviceItemQuoted: varchar("service_item_quoted").notNull(),
  quoteAmount: numeric("quote_amount").notNull(),
  quoteDate: date("quote_date"),
  vendorCompanyName: varchar("vendor_company_name"),
  validUntilDate: date("valid_until_date"),
  contactInfo: text("contact_info"),
  quoteReferenceNumber: varchar("quote_reference_number"),
});

// ========================================================================
// MANUALS
// ========================================================================
export const ManualDocuments = pgTable("manual_documents", {
  documentId: uuid("document_id")
    .primaryKey()
    .references(() => Documents.id, { onDelete: "cascade" }),

  title: varchar("title").notNull(),
  brandCompany: varchar("brand_company").notNull(),
  itemId: varchar("item_id"),
  modelNumber: varchar("model_number"),
  manualType: varchar("manual_type"),
  publicationDate: date("publication_date"),
});

// ========================================================================
// OTHER DOCUMENTS
// ========================================================================
export const OtherDocuments = pgTable("other_documents", {
  documentId: uuid("document_id")
    .primaryKey()
    .references(() => Documents.id, { onDelete: "cascade" }),

  title: varchar("title").notNull(),
  brandCompany: varchar("brand_company"),
  url: text("url"),
  notes: text("notes"),
});
