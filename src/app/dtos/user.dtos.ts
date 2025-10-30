import { TUserRole } from "../middleware/auth/auth.interface";

export interface ICreateUser {
  email: string;
  password: string;
  //   role?: TUserRole;
}
export interface ICreateProfile {
  first_name: string;
  last_name: string;
  user_name?: string;
  mobile?: string;
  address?: string;
  gender?: "male" | "female" | "other";
}
