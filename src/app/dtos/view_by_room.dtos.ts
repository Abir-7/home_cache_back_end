import { z } from "zod";

// --------------------
// Add ViewByRoom Schema
// --------------------
export const addViewByRoomSchema = z.object({
  type: z.string().optional(),
  location: z.string().optional(),
  brand: z.string().optional(),
  brand_line_color: z.string().optional(),
  finish: z.string().optional(),
  room: z.string().optional(),
  last_painted: z.string().optional(),
});
export type TAddViewByRoomInput = z.infer<typeof addViewByRoomSchema>;
// -----------------------
// Update ViewByRoom Schema
// -----------------------
export const updateViewByRoomSchema = z.object({
  type: z.string().optional(),
  location: z.string().optional(),

  brand: z.string().optional(),
  brandLineColor: z.string().optional(),
  finish: z.string().optional(),
  room: z.string().optional(),
  lastPainted: z.string().optional(),
});
export type TUpdateViewByRoomInput = z.infer<typeof updateViewByRoomSchema>;
