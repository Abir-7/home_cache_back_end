import { Request, Response } from "express";
import catchAsync from "../utils/serverTools/catchAsync";
import { AppError } from "../utils/serverTools/AppError";
import sendResponse from "../utils/serverTools/sendResponse";
import { ProviderService } from "../services/provider.service";
import { getRelativePath } from "../utils/helper/getRelativeFilePath";
import { appConfig } from "../config/appConfig";

export const createProvider = catchAsync(
  async (req: Request, res: Response) => {
    let documents: { file_id: string; url: string }[] = [];
    if (req.files && req.files.length !== 0) {
      documents = (req.files as Express.Multer.File[]).map((file) => {
        return {
          file_id: getRelativePath(file.path),
          url: `${appConfig.server.base_url}${getRelativePath(file.path)}`,
        };
      });
    }
    const result = await ProviderService.createProvider(
      { ...req.body, documents },
      req.user.user_id
    );

    sendResponse(res, {
      success: true,
      message: "Provider created successfully",
      status_code: 200,
      data: result,
    });
  }
);

// ================== GET PROVIDER BY ID ==================
const getProviderById = catchAsync(
  async (req: Request, res: Response) => {
    const { provider_id } = req.params;

    if (!provider_id) {
      throw new AppError("Provider ID is required", 400);
    }

    const result = await ProviderService.getProviderById(provider_id,req.user.user_id);

    sendResponse(res, {
      success: true,
      message: "Provider fetched successfully",
      status_code: 200,
      data: result,
    });
  }
);

// ================== GET ALL PROVIDERS ==================
const getAllProviders = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProviderService.getAllProviders(
      req.query,
      req.user.user_id
    );

    sendResponse(res, {
      success: true,
      message: "All providers fetched successfully",
      status_code: 200,
      data: result,
    });
  }
);

// ================== UPDATE PROVIDER ==================
export const updateProvider = catchAsync(
  async (req: Request, res: Response) => {
    const { provider_id } = req.params;
    const data = req.body;

    if (!provider_id) {
      throw new AppError("Provider ID is required", 400);
    }

    let documents: { file_id: string; url: string }[] = [];
    if (req.files && req.files.length !== 0) {
      documents = (req.files as Express.Multer.File[]).map((file) => {
        return {
          file_id: getRelativePath(file.path),
          url: `${appConfig.server.base_url}${getRelativePath(file.path)}`,
        };
      });
    }

    const result = await ProviderService.updateProvider(
      { ...data, documents },
      provider_id
    );

    if (!result) {
      throw new AppError("Provider not found or update failed", 404);
    }

    sendResponse(res, {
      success: true,
      message: "Provider updated successfully",
      status_code: 200,
      data: result,
    });
  }
);

export const ProviderController = {
  createProvider,
  getAllProviders,
  getProviderById,
  updateProvider,
};
