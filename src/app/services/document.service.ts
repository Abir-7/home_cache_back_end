import {
  TCreateDocumentPayload,
  TInsuranceInsert,
  TManualInsert,
  TOtherInsert,
  TQuoteInsert,
  TReceiptInsert,
  TWarrantyInsert,
} from "../dtos/document.dtos";
import { DocumentRepository } from "../repositories/document.repository";
import { Repository } from "../repositories/helper.repository";
import { AppError } from "../utils/serverTools/AppError";

const createDocumentWithType = async (payload: TCreateDocumentPayload) => {
  return await Repository.transaction(async (tx) => {
    const [doc] = await DocumentRepository.createDocument(payload.main, tx);
    if (!doc) throw new Error("Failed to create main document");

    const document_id = doc.id;

    const detailsWithDocId = { ...payload.details, document_id };

    switch (payload.main.type) {
      case "warranty":
        console.log("hit");
        await DocumentRepository.createWarranty(
          detailsWithDocId as TWarrantyInsert,
          tx
        );
        break;
      case "insurance":
        await DocumentRepository.createInsurance(
          detailsWithDocId as TInsuranceInsert,
          tx
        );
        break;
      case "receipt":
        await DocumentRepository.createReceipt(
          detailsWithDocId as TReceiptInsert,
          tx
        );
        break;
      case "quote":
        await DocumentRepository.createQuote(
          detailsWithDocId as TQuoteInsert,
          tx
        );
        break;
      case "manual":
        await DocumentRepository.createManual(
          detailsWithDocId as TManualInsert,
          tx
        );
        break;
      case "other":
        await DocumentRepository.createOther(
          detailsWithDocId as TOtherInsert,
          tx
        );
        break;
      default:
        throw new Error("Invalid document type");
    }
    return doc;
  });
};

const getAllDocumentWithDetails = async (user_id: string, type: string) => {
  return await DocumentRepository.getAllDocumentsWithDetails([user_id], type);
};

const getSingleDocumentWithDetails = async (doc_id: string) => {
  const doc = await DocumentRepository.getSingleDocumentWithDetails(doc_id);

  if (!doc) {
    throw new AppError("Document not found.", 404);
  }
  return doc;
};

const deleteDocument = async (doc_id: string) => {
  return await DocumentRepository.deleteDocument(doc_id);
};
// -------------------------
// EXPORT SERVICE
// -------------------------
export const DocumentService = {
  createDocumentWithType,
  getAllDocumentWithDetails,
  getSingleDocumentWithDetails,
  deleteDocument,
};
