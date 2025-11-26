import { z } from "zod";

// --------------------
// Add ViewByRoom Schema
// --------------------
export const addViewByRoomSchema = z.object({
  type: z.string().optional(),
  location: z.string().optional(),
  brand: z.string().optional(),
  brand_line: z.string().optional(),
  color: z.string().optional(),
  finish: z.string().optional(),
  room: z.string().optional(),
  last_painted: z.string().optional(),
});
export type TAddViewByRoomItemDetailsInput = z.infer<
  typeof addViewByRoomSchema
>;
