export const extractMainAndDetailFields = (body: Record<string, any>) => {
  const mainFields = ["type", "added_by", "files"];

  const warrantyFields = [
    "name",
    "brand",
    "warranty_start_date",
    "warranty_end_date",
    "serial_number",
    "service_contact_info",
  ];

  const insuranceFields = [
    "policy_number",
    "provider_name",
    "coverage_start_date",
    "coverage_end_date",
    "premium_amount",
    "claim_contact_info",
  ];

  const receiptFields = [
    "vendor_store_name",
    "date_of_purchase",
    "total_amount_paid",
    "payment_method",
    "order_number",
  ];

  const quoteFields = [
    "service_item_quoted",
    "quote_amount",
    "quote_date",
    "vendor_company_name",
    "valid_until_date",
    "contact_info",
    "quote_reference_number",
  ];

  const manualFields = [
    "title",
    "brand_company",
    "item_id",
    "model_number",
    "manual_type",
    "publication_date",
  ];

  const otherFields = ["title", "brand_company", "url", "notes"];

  // --------------------------
  // Split MAIN fields
  // --------------------------
  const main: any = {};
  for (const key of mainFields) {
    if (body[key] !== undefined) {
      main[key] = body[key];
    }
  }

  // --------------------------
  // Determine which detail fields to use
  // --------------------------
  let detailFieldList: string[] = [];

  switch (body.type) {
    case "warranty":
      detailFieldList = warrantyFields;
      break;
    case "insurance":
      detailFieldList = insuranceFields;
      break;
    case "receipt":
      detailFieldList = receiptFields;
      break;
    case "quote":
      detailFieldList = quoteFields;
      break;
    case "manual":
      detailFieldList = manualFields;
      break;
    case "other":
      detailFieldList = otherFields;
      break;
    default:
      throw new Error("Invalid or missing document type");
  }

  // --------------------------
  // Extract DETAIL fields
  // --------------------------
  const details: any = {};
  for (const key of detailFieldList) {
    if (body[key] !== undefined) {
      details[key] = body[key];
    }
  }

  return { main, details };
};
