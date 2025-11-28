import { Request, Response } from "express";
import catchAsync from "../utils/serverTools/catchAsync";
import { DocumentService } from "../services/document.service";
import sendResponse from "../utils/serverTools/sendResponse";
import { extractMainAndDetailFields } from "../utils/helper/create_document/splitDocumentData";

const createDocumentWithDetails = catchAsync(
  async (req: Request, res: Response) => {
    const files = req.files as Express.MulterS3.File[] | undefined;

    const mappedFiles =
      files?.map((f) => ({
        file_url: f.location,
        file_id: f.key,
      })) ?? [];

    const { main, details } = extractMainAndDetailFields(req.body);

    main.files = mappedFiles;
    main.added_by = req.user.user_id;
    const result = await DocumentService.createDocumentWithType({
      main,
      details,
    });

    // 4. Send response
    sendResponse(res, {
      success: true,
      message: "Document created successfully",
      status_code: 200,
      data: result,
    });
  }
);

const getAllDocumentWithDetails = catchAsync(
  async (req: Request, res: Response) => {
    const result = await DocumentService.getAllDocumentWithDetails(
      req.user.user_id,
      req.query.type as string
    );
    sendResponse(res, {
      success: true,
      message: "All Document fetched.",
      status_code: 200,
      data: result,
    });
  }
);

const getSingleDocumentWithDetails = catchAsync(
  async (req: Request, res: Response) => {
    const result = await DocumentService.getSingleDocumentWithDetails(
      req.params.doc_id
    );
    sendResponse(res, {
      success: true,
      message: " Document fetched.",
      status_code: 200,
      data: result,
    });
  }
);

const deleteSingleDocument = catchAsync(async (req: Request, res: Response) => {
  const result = await DocumentService.deleteDocument(req.params.doc_id);
  sendResponse(res, {
    success: true,
    message: " Document deleted.",
    status_code: 200,
    data: result,
  });
});

const updateFiles = catchAsync(async (req: Request, res: Response) => {
  const documentId = req.params.doc_id; // <-- FIXED

  const files = (req.files as Express.MulterS3.File[]) || [];

  const addFiles = files.map((f) => ({
    file_url: f.location,
    file_id: f.key,
  }));

  let removeFileIds: string[] = [];

  if (req.body.remove_file_ids) {
    removeFileIds = Array.isArray(req.body.remove_file_ids)
      ? req.body.remove_file_ids
      : [req.body.remove_file_ids];
  }

  const updated = await DocumentService.updateDocumentFile({
    documentId,
    addFiles,
    removeFileIds,
  });

  return sendResponse(res, {
    success: true,
    message: "Files updated successfully",
    status_code: 200,
    data: updated,
  });
});

const updateDocumentDetails = catchAsync(
  async (req: Request, res: Response) => {
    const documentId = req.params.doc_id; // <-- FIXED

    const updated = await DocumentService.updateDocumentDetails(
      documentId,
      req.body
    );

    return sendResponse(res, {
      success: true,
      message: "Details updated successfully",
      status_code: 200,
      data: updated,
    });
  }
);

export const DocumentController = {
  createDocumentWithDetails,
  getAllDocumentWithDetails,
  getSingleDocumentWithDetails,
  deleteSingleDocument,
  updateFiles,
  updateDocumentDetails,
};
