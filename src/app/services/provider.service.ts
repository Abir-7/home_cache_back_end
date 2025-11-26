import { ProviderRepository } from "../repositories/provider.repository";
import { ProviderFilter } from "../types/prodiver_repository.interface";
import { AppError } from "../utils/serverTools/AppError";

const createProvider = async (data: any, user_id: string) => {
  return await ProviderRepository.createProvider({ ...data, user_id });
};

// ================== UPDATE ==================
const updateProvider = async (data: any, provider_id: string) => {
  const existing_provider = await ProviderRepository.getProviderById(
    provider_id
  );
  if (!existing_provider) {
    throw new AppError("Provider not found or update failed", 404);
  }

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
const getProviderById = async (provider_id: string, user_id: string) => {
  const provider = await ProviderRepository.getProviderById(provider_id);
  const appointments = await ProviderRepository.getProviderAppointments(
    provider_id,
    user_id
  );

  return {
    provider,
    ...appointments, // { lastAppointment, nextAppointment }
  };
};
// ================== GET ALL ==================
const getAllProviders = async (filter: ProviderFilter, user_id: string) => {
  return await ProviderRepository.getFilteredProvidersWithUserFollow(
    filter,
    user_id
  );
};

// ====================Provider follow=============
const toogleProviderFollow = async (data: {
  provider_id: string;
  user_id: string;
}) => {
  const follow_data = await ProviderRepository.getProviderFollow(
    data.user_id,
    data.provider_id
  );

  if (follow_data && follow_data.id) {
    await ProviderRepository.toogleProviderFollow(
      data.user_id,
      data.provider_id,
      "delete"
    );

    return { provider_id: data.provider_id, is_followed: false };
  } else {
    await ProviderRepository.toogleProviderFollow(
      data.user_id,
      data.provider_id,
      "add"
    );
    return { provider_id: data.provider_id, is_followed: true };
  }
};

export const ProviderService = {
  createProvider,
  updateProvider,
  getProviderById,
  getAllProviders,
  toogleProviderFollow,
};
