import { UserRepository } from "../repositories/user.repository";
import { UserHomeDataPayload } from "../types/user_service.types";
import { AppError } from "../utils/serverTools/AppError";

const updateHomeDataOfUser = async (
  user_id: string,
  data: Partial<UserHomeDataPayload>
) => {
  const users_home_data = await UserRepository.getUsersHomeData(user_id);
  if (!users_home_data) {
    throw new AppError("User home data not found.");
  }
  const updated_home_data = await UserRepository.updateUserHomeData(
    user_id,
    data
  );

  return updated_home_data;
};

export const UserServce = { updateHomeDataOfUser };
