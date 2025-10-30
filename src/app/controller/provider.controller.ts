import { Request, Response } from "express";
import catchAsync from "../utils/serverTools/catchAsync";
import { AppError } from "../utils/serverTools/AppError";
import sendResponse from "../utils/serverTools/sendResponse";
import { ProviderService } from "../services/provider.service";

export const createProvider = catchAsync(
  async (req: Request, res: Response) => {
    const { name, email, phone, address } = req.body;

    const result = await ProviderService.createProvider(
      req.body,
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
export const getProviderById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new AppError("Provider ID is required", 400);
    }

    const result = await getProviderByIdService(id);

    if (!result) {
      throw new AppError("Provider not found", 404);
    }

    sendResponse(res, {
      success: true,
      message: "Provider fetched successfully",
      status_code: 200,
      data: result,
    });
  }
);

// ================== GET ALL PROVIDERS ==================
export const getAllProviders = catchAsync(
  async (_req: Request, res: Response) => {
    const result = await getAllProvidersService();

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
    const { id } = req.params;
    const data = req.body;

    if (!id) {
      throw new AppError("Provider ID is required", 400);
    }

    const result = await updateProviderService({ id, ...data });

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

// ================== DELETE PROVIDER ==================
export const deleteProvider = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new AppError("Provider ID is required", 400);
    }

    const result = await deleteProviderService(id);

    if (!result) {
      throw new AppError("Provider not found or delete failed", 404);
    }

    sendResponse(res, {
      success: true,
      message: "Provider deleted successfully",
      status_code: 200,
      data: result,
    });
  }
);
