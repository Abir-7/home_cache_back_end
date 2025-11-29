import z from "zod";
import { TUserRole } from "../middleware/auth/auth.interface";
import { genders } from "../schema/user_profiles.schema";

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

export const UserProfileSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  first_name: z.string().max(100).nullable().optional(),
  last_name: z.string().max(100).nullable().optional(),
  user_name: z.string().max(50).nullable().optional(),
  mobile: z.string().max(20).nullable().optional(),
  address: z.string().nullable().optional(),
  gender: z.enum([...genders]).optional(),
  image: z.string().nullable().optional(),
  image_id: z.string().nullable().optional(),
});

export type TUserProfile = z.infer<typeof UserProfileSchema>;
