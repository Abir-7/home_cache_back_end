import { UserRepository } from "../repositories/user.repository";
import { AppError } from "../utils/serverTools/AppError";

const updateHomeDataOfUser = async (user_id: string, data: any) => {
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
