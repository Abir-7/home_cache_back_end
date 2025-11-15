import { Request, Response } from "express";
import { DocumentService } from "../services/document.service";
import catchAsync from "../utils/serverTools/catchAsync";
import sendResponse from "../utils/serverTools/sendResponse";
import { TFile } from "../dtos/document.dtos";
import { getRelativePath } from "../utils/helper/getRelativeFilePath";
import { appConfig } from "../config/appConfig";

const saveNewDocument = catchAsync(async (req: Request, res: Response) => {
  //Local-------------------
  // const files = req.files as Express.Multer.File[];

  // let filedata: TFile[] = [];

  // if (files.length > 0) {
  //   filedata = files.map((file) => {
  //     return {
  //       file_id: getRelativePath(file.path),
  //       file_url: `${appConfig.server.base_url}${getRelativePath(file.path)}`,
  //     };
  //   });
  // }

  // const result = await DocumentService.saveNewDocument(req.user.user_id, {
  //   ...req.body,
  //   files: filedata,
  // });

  //S3-------------------
  let filedata: TFile[] = [];
  const files = req.files as Express.MulterS3.File[];
  if (files.length > 0) {
    filedata = files.map((file) => {
      return {
        file_id: file.key,
        file_url: file.location,
      };
    });
  }

  const result = await DocumentService.saveNewDocument(req.user.user_id, {
    ...req.body,
    files: filedata,
  });

  sendResponse(res, {
    success: true,
    message: "Document saved successfully",
    status_code: 200,
    data: result,
  });
});

const getAllDocument = catchAsync(async (req: Request, res: Response) => {
  const result = await DocumentService.getAllDocument(req.query.type as string);
  sendResponse(res, {
    success: true,
    message: "All Document fetched successfully",
    status_code: 200,
    data: result,
  });
});

const getSingleDocument = catchAsync(async (req: Request, res: Response) => {
  const result = await DocumentService.getSingleDocument(
    req.params.document_id
  );
  sendResponse(res, {
    success: true,
    message: "Document fetched successfully",
    status_code: 200,
    data: result,
  });
});

const deleteSingleDocument = catchAsync(async (req: Request, res: Response) => {
  const result = await DocumentService.deleteSingleDocument(
    req.params.document_id
  );
  sendResponse(res, {
    success: true,
    message: "Document deleted successfully",
    status_code: 200,
    data: result,
  });
});

export const DocumentController = {
  saveNewDocument,
  getAllDocument,
  getSingleDocument,
  deleteSingleDocument,
};
