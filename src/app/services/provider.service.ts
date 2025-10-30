import { ProviderRepository } from "../repositories/provider.repository";

const createProvider = async (data: any, user_id: string) => {
  return await ProviderRepository.createProvider({ ...data, user_id });
};

// ================== UPDATE ==================
const updateProvider = async (data: any, provider_id: string) => {
  return await ProviderRepository.updateProvider(data, provider_id);
};

// ================== GET BY ID ==================
const getProviderById = async (id: string) => {
  return await ProviderRepository.getProviderById(id);
};

// ================== GET ALL ==================
const getAllProviders = async () => {
  return await ProviderRepository.getAllProviders();
};

export const ProviderService = {
  createProvider,
  updateProvider,
  getProviderById,
  getAllProviders,
};
