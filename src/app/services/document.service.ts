import { TFile, TNewDocument } from "../dtos/document.dtos";
import { DocumentRepository } from "../repositories/document.repository";

const saveNewDocument = async (
  user_id: string,
  data: TNewDocument & { files: TFile[] }
) => {
  return await DocumentRepository.addNewDocument({
    ...data,
    added_by: user_id,
    ...(data.exp_date ? { exp_date: new Date(data.exp_date) } : {}),
  });
};

const getAllDocument = async (type: string) => {
  return await DocumentRepository.getAllDocument(type);
};

const getSingleDocument = async (document_id: string) => {
  return await DocumentRepository.getSingleDocument(document_id);
};
const deleteSingleDocument = async (document_id: string) => {
  return await DocumentRepository.deleteSingleDocument(document_id);
};

export const DocumentService = {
  saveNewDocument,
  getAllDocument,
  getSingleDocument,
  deleteSingleDocument,
};
