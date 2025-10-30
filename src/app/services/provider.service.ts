import { ProviderRepository } from "../repositories/provider.repository";

const createProvider = async (data: any, user_id: string) => {
  return await ProviderRepository.createProvider({ ...data, user_id });
};

// ================== UPDATE ==================
const updateProvider = async (data: any, provider_id: string) => {
  const existing_provider = await ProviderRepository.getProviderById(
    provider_id
  );

  let previous_document = existing_provider.documents ?? [];

  if (data.documents && data.documents.length > 0) {
    previous_document = [...previous_document, ...data.documents];
  }

  return await ProviderRepository.updateProvider(
    { ...data, documents: previous_document },
    provider_id
  );
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
