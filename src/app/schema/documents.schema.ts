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
  ...timestamps,
});

// ========================================================================
// WARRANTY
// ========================================================================
export const WarrantyDocuments = pgTable("warranty_documents", {
  document_id: uuid("document_id")
    .primaryKey()
    .references(() => Documents.id, { onDelete: "cascade" }),

  name: varchar("name").notNull(),
  brand: varchar("brand").notNull(),
  warranty_start_date: date("warranty_start_date"),
  warranty_end_date: date("warranty_end_date").notNull(),
  serial_number: varchar("serial_number"),
  service_contact_info: text("service_contact_info"),
});

// ========================================================================
// INSURANCE
// ========================================================================
export const InsuranceDocuments = pgTable("insurance_documents", {
  document_id: uuid("document_id")
    .primaryKey()
    .references(() => Documents.id, { onDelete: "cascade" }),

  policy_number: varchar("policy_number").notNull(),
  provider_name: varchar("provider_name").notNull(),
  coverage_start_date: date("coverage_start_date"),
  coverage_end_date: date("coverage_end_date").notNull(),
  premium_amount: numeric("premium_amount"),
  claim_contact_info: text("claim_contact_info"),
});

// ========================================================================
// RECEIPTS
// ========================================================================
export const ReceiptDocuments = pgTable("receipt_documents", {
  document_id: uuid("document_id")
    .primaryKey()
    .references(() => Documents.id, { onDelete: "cascade" }),

  vendor_store_name: varchar("vendor_store_name").notNull(),
  date_of_purchase: date("date_of_purchase"),
  total_amount_paid: numeric("total_amount_paid").notNull(),
  payment_method: varchar("payment_method"),
  order_number: varchar("order_number"),
});

// ========================================================================
// QUOTES
// ========================================================================
export const QuoteDocuments = pgTable("quote_documents", {
  document_id: uuid("document_id")
    .primaryKey()
    .references(() => Documents.id, { onDelete: "cascade" }),

  service_item_quoted: varchar("service_item_quoted").notNull(),
  quote_amount: numeric("quote_amount").notNull(),
  quote_date: date("quote_date"),
  vendor_company_name: varchar("vendor_company_name"),
  valid_until_date: date("valid_until_date"),
  contact_info: text("contact_info"),
  quote_reference_number: varchar("quote_reference_number"),
});

// ========================================================================
// MANUALS
// ========================================================================
export const ManualDocuments = pgTable("manual_documents", {
  document_id: uuid("document_id")
    .primaryKey()
    .references(() => Documents.id, { onDelete: "cascade" }),

  title: varchar("title").notNull(),
  brand_company: varchar("brand_company").notNull(),
  item_id: varchar("item_id"),
  model_number: varchar("model_number"),
  manual_type: varchar("manual_type"),
  publication_dateedd: date("publication_date"),
});

// ========================================================================
// OTHER DOCUMENTS
// ========================================================================
export const OtherDocuments = pgTable("other_documents", {
  document_id: uuid("document_id")
    .primaryKey()
    .references(() => Documents.id, { onDelete: "cascade" }),

  title: varchar("title").notNull(),
  brand_company: varchar("brand_company"),
  url: text("url"),
  notes: text("notes"),
});
